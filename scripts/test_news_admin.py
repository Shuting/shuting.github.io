import base64
import copy
import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch
import news_admin as app


class NewsAdminTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.data = Path(self.temp.name) / 'news.json'
        self.items = json.loads(app.DATA.read_bytes())
        self.raw = app.encode(self.items)
        self.data.write_bytes(self.raw)
        self.data_patch = patch.object(app, 'DATA', self.data)
        self.data_patch.start()
        self.server = app.AdminServer(('127.0.0.1', 0))
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.origin = f'http://127.0.0.1:{self.server.server_port}'

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.data_patch.stop()
        self.temp.cleanup()

    def request(self, path, body=None, headers=None):
        h = {'Content-Type': 'application/json', 'X-Editor-Token': self.server.csrf}
        h.update(headers or {})
        req = urllib.request.Request(self.origin + path, headers=h,
            data=json.dumps(body).encode() if body is not None else None)
        try:
            response = urllib.request.urlopen(req)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, response.read()

    def remote(self):
        return {'sha': app.blob_sha(self.raw), 'content': base64.b64encode(self.raw).decode()}

    def test_state_and_health_do_not_expose_credentials(self):
        code, raw = self.request('/api/state')
        self.assertEqual(code, 200)
        self.assertEqual(set(json.loads(raw)), {'items', 'sha', 'token'})
        self.assertTrue(app.existing_editor(self.server.server_port))
        server, port = app.start_or_reuse(self.server.server_port)
        self.assertIsNone(server)
        self.assertEqual(port, self.server.server_port)

    def test_cross_origin_and_wrong_host_rejected(self):
        for headers in [{'Origin': 'https://example.com'}, {'Host': 'example.com'}]:
            self.assertEqual(self.request('/api/state', headers=headers)[0], 403)
        self.assertEqual(self.request('/api/preview', {'items': self.items}, {'X-Editor-Token': 'bad'})[0], 403)

    def test_private_files_hidden(self):
        for path in ['/.git/config', '/scripts/news_admin.py', '/admin/../scripts/news_admin.py', '/admin/', '/data/../../.git/config']:
            self.assertEqual(self.request(path)[0], 404)

    def test_preview_does_not_mutate_published_data(self):
        edited = copy.deepcopy(self.items)
        edited[0]['title'] = '测试预览 <script>alert(1)</script>'
        self.assertEqual(self.request('/api/preview', {'items': edited})[0], 200)
        self.assertEqual(json.loads(self.request('/api/preview')[1])['items'], edited)
        self.assertEqual(self.data.read_bytes(), self.raw)

    def test_validation(self):
        for changes in [{'date': '2026-02-30'}, {'category': '<script>'}, {'text': ' '}, {'title': 'x' * 161}, {'extra': 'unexpected'}]:
            edited = copy.deepcopy(self.items)
            edited[0].update(changes)
            self.assertEqual(self.request('/api/preview', {'items': edited})[0], 400)
        self.assertEqual(self.request('/api/preview', {'items': self.items * 2})[0], 400)

    def test_conflict_never_writes(self):
        with patch.object(app, 'github', return_value=self.remote()) as github:
            self.assertEqual(self.request('/api/publish', {'sha': 'stale', 'items': self.items})[0], 409)
            self.assertEqual(github.call_count, 1)
        self.assertEqual(self.data.read_bytes(), self.raw)

    def test_publish_updates_only_fixed_file_and_syncs_local(self):
        edited = copy.deepcopy(self.items)
        edited[0]['title'] = '更新后的标题'
        updated = app.encode(edited)
        result = {'content': {'sha': app.blob_sha(updated)}, 'commit': {'html_url': 'https://github.com/commit/test'}}
        with patch.object(app, 'github', side_effect=[self.remote(), result]) as github:
            code, raw = self.request('/api/publish', {'sha': app.blob_sha(self.raw), 'items': edited})
            self.assertEqual(code, 200)
            self.assertEqual(json.loads(raw)['sha'], app.blob_sha(updated))
            path, method, payload = github.call_args.args
            self.assertEqual(path, app.CONTENT)
            self.assertEqual(method, 'PUT')
            self.assertEqual(payload['branch'], 'main')
            self.assertEqual(payload['sha'], app.blob_sha(self.raw))
            self.assertEqual(base64.b64decode(payload['content']), updated)
        self.assertEqual(self.data.read_bytes(), updated)

    def test_no_change_no_commit_and_failure_preserves_file(self):
        with patch.object(app, 'github', return_value=self.remote()) as github:
            code, raw = self.request('/api/publish', {'sha': app.blob_sha(self.raw), 'items': self.items})
            self.assertEqual(code, 200)
            self.assertTrue(json.loads(raw)['unchanged'])
            self.assertEqual(github.call_count, 1)
        with patch.object(app, 'github', side_effect=app.EditorError('network', 502)):
            self.assertEqual(self.request('/api/publish', {'sha': app.blob_sha(self.raw), 'items': self.items})[0], 502)
        self.assertEqual(self.data.read_bytes(), self.raw)

    def test_sync_reads_remote(self):
        self.data.write_text('[]\n')
        with patch.object(app, 'github', return_value=self.remote()):
            self.assertEqual(self.request('/api/sync', {})[0], 200)
        self.assertEqual(self.data.read_bytes(), self.raw)


if __name__ == '__main__':
    unittest.main()
