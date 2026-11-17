#!/usr/bin/env python3
"""Loopback-only news editor. Uses the Mac's existing Git credential helper."""
import argparse
import base64
import datetime
import errno
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import subprocess
import threading
import urllib.error
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data/news.json'
REPO = 'Shuting/shuting.github.io'
CONTENT = '/repos/' + REPO + '/contents/data/news.json'
CATEGORIES = {'papers', 'projects', 'talks', 'team'}
LIMITS = {'id': 80, 'date': 10, 'category': 20, 'title': 160, 'text': 3000,
          'work': 1000, 'brief': 40, 'stamp': 100, 'note': 100}


class EditorError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def validate(items):
    if not isinstance(items, list) or len(items) > 3000:
        raise EditorError('动态清单格式不正确，最多支持 3000 条。')
    seen = set()
    for n in items:
        if not isinstance(n, dict) or set(n) - set(LIMITS):
            raise EditorError('动态中含有无法识别的字段。')
        for key, limit in LIMITS.items():
            value = n.get(key, '')
            if not isinstance(value, str) or len(value) > limit or '\x00' in value:
                raise EditorError('动态字段过长或格式不正确：' + key)
        if not re.fullmatch(r'[a-zA-Z0-9_-]{1,80}', n.get('id', '')) or n['id'] in seen:
            raise EditorError('动态编号无效或重复。')
        seen.add(n['id'])
        if n.get('category') not in CATEGORIES or not n.get('title', '').strip() or not n.get('text', '').strip():
            raise EditorError('请填写类别、标题和正文。')
        try:
            date = datetime.date.fromisoformat(n.get('date', ''))
            if date.isoformat() != n['date']:
                raise ValueError()
        except ValueError:
            raise EditorError('请填写有效日期。')
    return items


def blob_sha(raw):
    return hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()


def encode(items):
    return (json.dumps(validate(items), ensure_ascii=False, indent=2) + '\n').encode()


def credential():
    # Never return credentials to the browser, log them, or persist them in this app.
    try:
        result = subprocess.run(['git', 'credential', 'fill'], cwd=ROOT,
            input='protocol=https\nhost=github.com\n\n', text=True,
            capture_output=True, timeout=20,
            env={**os.environ, 'GIT_TERMINAL_PROMPT': '0'})
        values = dict(line.split('=', 1) for line in result.stdout.splitlines() if '=' in line)
        if result.returncode or not values.get('password'):
            raise ValueError()
        return values['password']
    except (ValueError, subprocess.SubprocessError):
        raise EditorError('未找到这台 Mac 的 GitHub 登录凭据。请先在终端完成 GitHub 登录，再重试；不要在网页或聊天中填写密码。', 401)


def github(path, method='GET', payload=None):
    request = urllib.request.Request('https://api.github.com' + path,
        method=method, data=json.dumps(payload).encode() if payload is not None else None,
        headers={'Authorization': 'Bearer ' + credential(), 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'TingShu-Local-News-Editor',
                 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        if error.code in (409, 422):
            raise EditorError('线上内容已经变化。请先导出草稿，再读取线上版本并合并修改。', 409)
        if error.code in (401, 403):
            raise EditorError('GitHub 登录已失效、权限不足或请求受限，请检查这台 Mac 的 GitHub 登录。', 401)
        if error.code == 404:
            raise EditorError('线上数据文件尚未就绪，请先部署包含管理功能的网站版本。', 404)
        raise EditorError('GitHub 暂时无法处理请求，请稍后重试。', 502)
    except (urllib.error.URLError, TimeoutError):
        raise EditorError('无法连接 GitHub。草稿仍在，请检查网络后重试。', 502)


class AdminServer(ThreadingHTTPServer):
    def __init__(self, address):
        super().__init__(address, Handler)
        self.csrf = secrets.token_urlsafe(32)
        self.lock = threading.Lock()
        self.preview = None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        pass

    def allowed(self, mutate=False):
        expected = '127.0.0.1:' + str(self.server.server_port)
        if self.headers.get('Host') != expected:
            raise EditorError('仅允许本机访问。', 403)
        origin = self.headers.get('Origin')
        if origin and origin != 'http://' + expected:
            raise EditorError('请求来源不正确。', 403)
        if mutate and (self.headers.get('X-Editor-Token') != self.server.csrf or
                       self.headers.get_content_type() != 'application/json'):
            raise EditorError('编辑会话已过期，请刷新页面。', 403)

    def reply(self, data, status=200):
        raw = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'same-origin')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        super().end_headers()

    def do_GET(self):
        try:
            self.allowed()
            if self.path == '/api/health':
                return self.reply({'app': 'ting-shu-news-editor', 'workspace': str(ROOT)})
            if self.path == '/api/state':
                raw = DATA.read_bytes()
                return self.reply({'items': validate(json.loads(raw)), 'sha': blob_sha(raw), 'token': self.server.csrf})
            if self.path == '/api/preview':
                return self.reply({'items': self.server.preview if self.server.preview is not None else json.loads(DATA.read_bytes())})
            if self.path.startswith('/api/'):
                raise EditorError('没有这个接口。', 404)
            # Only website assets are served, never .git, scripts, or arbitrary local files.
            path = Path(self.translate_path(self.path)).resolve()
            relative = path.relative_to(ROOT)
            if any(p.startswith('.') for p in relative.parts) or path.is_dir() or (
                len(relative.parts) > 1 and relative.parts[0] not in {'admin', 'assets', 'data', 'vendor'}
            ) or path.suffix.lower() not in {'.html', '.js', '.mjs', '.css', '.json', '.geojson', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff', '.woff2', '.ttf', '.bib'}:
                raise EditorError('文件不可访问。', 404)
            return super().do_GET()
        except EditorError as error:
            self.reply({'error': str(error)}, error.status)
        except (OSError, ValueError):
            self.reply({'error': '本地数据读取失败，请检查文件。'}, 500)

    def do_POST(self):
        try:
            self.allowed(mutate=True)
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 2_000_000:
                raise EditorError('请求大小不正确。')
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise EditorError('请求格式不正确。')
            if self.path == '/api/preview':
                self.server.preview = validate(data.get('items'))
                return self.reply({'ok': True})
            if self.path not in {'/api/publish', '/api/sync'}:
                raise EditorError('没有这个接口。', 404)
            with self.server.lock:
                remote = github(CONTENT + '?ref=main')
                remote_raw = base64.b64decode(remote['content'])
                if self.path == '/api/sync':
                    items = validate(json.loads(remote_raw))
                    self.write_local(remote_raw)
                    return self.reply({'items': items, 'sha': remote['sha']})
                raw = encode(data.get('items'))
                if data.get('sha') != remote['sha'] or data.get('sha') != blob_sha(DATA.read_bytes()):
                    raise EditorError('线上或本地内容已变化。请先导出草稿，再读取线上版本并合并修改。', 409)
                if json.loads(remote_raw) == json.loads(raw):
                    return self.reply({'sha': remote['sha'], 'unchanged': True})
                result = github(CONTENT, 'PUT', {'message': 'Update team news from local editor',
                    'content': base64.b64encode(raw).decode(), 'sha': remote['sha'], 'branch': 'main'})
                warning = ''
                try:
                    self.write_local(raw)
                except OSError:
                    warning = '线上已提交，但本地副本未能保存；请读取线上版本同步。'
                return self.reply({'sha': result['content']['sha'], 'commit': result['commit']['html_url'],
                    'warning': warning, 'actions': 'https://github.com/' + REPO + '/actions'})
        except EditorError as error:
            self.reply({'error': str(error)}, error.status)
        except (ValueError, KeyError, TypeError):
            self.reply({'error': '数据格式不正确，未能完成操作。'}, 400)
        except OSError:
            self.reply({'error': '本地文件操作失败，请检查文件权限。'}, 500)

    @staticmethod
    def write_local(raw):
        temp = DATA.with_suffix('.json.tmp')
        temp.write_bytes(raw)
        temp.replace(DATA)


def existing_editor(port):
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/health', timeout=1) as response:
            info = json.load(response)
            return info.get('app') == 'ting-shu-news-editor' and info.get('workspace') == str(ROOT)
    except (OSError, ValueError):
        return False


def start_or_reuse(port):
    for candidate in range(port, min(port + 10, 65536)):
        try:
            return AdminServer(('127.0.0.1', candidate)), candidate
        except OSError as error:
            if error.errno != errno.EADDRINUSE:
                raise
            if existing_editor(candidate):
                return None, candidate
    raise OSError(errno.EADDRINUSE, '没有空闲端口')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8766)
    parser.add_argument('--no-open', action='store_true')
    args = parser.parse_args()
    try:
        server, port = start_or_reuse(args.port)
    except OSError as error:
        print('暂时无法启动后台：' + ('附近端口均被占用。' if error.errno == errno.EADDRINUSE else str(error)))
        return
    url = f'http://127.0.0.1:{port}/admin/index.html'
    if server is None:
        print('后台已经在运行，正在打开管理页面：' + url, flush=True)
        if not args.no_open:
            webbrowser.open(url)
        return
    print('团队动态管理已启动：' + url, flush=True)
    print('编辑期间保留此窗口；结束时按 Control+C 或关闭窗口。', flush=True)
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
