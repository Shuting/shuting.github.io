"""Build the decorative regional illustration from Natural Earth land polygons.
Usage: python3 scripts/build-south-china.py /path/to/ne_50m_land.geojson
Coastline coordinates are real; curvature, terrain shading and clouds are illustrative.
"""
from pathlib import Path
import json,math,sys,random
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]) if len(sys.argv)>1 else root/'data/south-china-land.geojson'
data=json.loads(source.read_text())
def clip(poly,axis,bound,greater):
 if not poly:return []
 out=[];a=poly[-1];inside=lambda p:p[axis]>=bound if greater else p[axis]<=bound
 for b in poly:
  ain,bin=inside(a),inside(b)
  if ain!=bin:
   t=(bound-a[axis])/(b[axis]-a[axis]);out.append([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])])
  if bin:out.append(b)
  a=b
 return out
def project(lon,lat):
 x=720+(lon-112)*94*math.cos(math.radians(lat));y=45+(28-lat)*27+(x-720)**2*.00028
 return (x,y)
paths=[];features=[]
for f in data['features']:
 geom=f['geometry'];polys=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
 for poly in polys:
  if not any(102<=p[0]<=122 and 13<=p[1]<=30 for ring in poly for p in ring):continue
  rings=[]
  for ring in poly:
   for ax,lim,g in [(0,102,True),(0,122,False),(1,13,True),(1,30,False)]:ring=clip(ring,ax,lim,g)
   if len(ring)>2:
    rings.append(ring)
    dense=[]
    for a,b in zip(ring,ring[1:]+ring[:1]):
     steps=max(1,int(max(abs(a[0]-b[0]),abs(a[1]-b[1]))/.15))
     for k in range(steps):dense.append([a[0]+(b[0]-a[0])*k/steps,a[1]+(b[1]-a[1])*k/steps])
    paths.append('M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in map(lambda p:project(*p),dense))+'Z')
  if rings:features.append({'type':'Feature','properties':{},'geometry':{'type':'Polygon','coordinates':rings}})
(root/'data/south-china-land.geojson').write_text(json.dumps({'type':'FeatureCollection','features':features},separators=(',',':')))
d=' '.join(paths)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 440" preserveAspectRatio="none" role="img" aria-labelledby="title desc"><title id="title">华南 · South China</title><desc id="desc">基于 Natural Earth 的华南海岸线示意，包含广东、广西沿海、雷州半岛、海南岛与琼州海峡。弧面、地形纹理与云层为艺术化表达。</desc><defs>
<radialGradient id="ocean" cx="50%" cy="0%" r="100%"><stop stop-color="#d4e9ec"/><stop offset=".45" stop-color="#a9cfd9"/><stop offset="1" stop-color="#e6eeea"/></radialGradient>
<linearGradient id="land" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#e8edd5"/><stop offset=".45" stop-color="#b2c9a3"/><stop offset="1" stop-color="#d6dfb5"/></linearGradient>
<radialGradient id="light"><stop stop-color="#fffbea" stop-opacity=".35"/><stop offset="1" stop-color="#fffbea" stop-opacity="0"/></radialGradient>
<linearGradient id="fade" x2="0" y2="1"><stop offset=".7" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient>
<mask id="soft-bottom"><rect width="1440" height="440" fill="url(#fade)"/></mask>
<clipPath id="globe"><ellipse cx="720" cy="525" rx="1000" ry="495"/></clipPath>
<path id="coast" d="{d}"/>
<clipPath id="land-clip"><use href="#coast"/></clipPath>
<filter id="relief" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .026" numOctaves="4" seed="8" result="noise"/><feDiffuseLighting in="noise" surfaceScale="5" diffuseConstant=".8" lighting-color="#d4e0b9"><feDistantLight azimuth="235" elevation="44"/></feDiffuseLighting><feBlend in="SourceGraphic" mode="soft-light"/></filter>
<filter id="cloud"><feGaussianBlur stdDeviation="8"/></filter>
</defs><g mask="url(#soft-bottom)"><ellipse cx="720" cy="528" rx="1005" ry="503" fill="#cce2df" opacity=".4"/><g clip-path="url(#globe)"><rect width="1440" height="440" fill="url(#ocean)"/><use href="#coast" transform="translate(0,3)" fill="#749f9a" opacity=".24"/><use href="#coast" fill="url(#land)" fill-rule="evenodd" stroke="#eff0d6" stroke-width="1.4"/>
<g clip-path="url(#land-clip)" opacity=".55"><rect x="0" y="0" width="1440" height="440" fill="#c5d5ab" filter="url(#relief)"/></g><use href="#coast" fill="none" stroke="#f7f4db" stroke-width="1" opacity=".8"/><ellipse cx="590" cy="65" rx="630" ry="260" fill="url(#light)"/>
'''
random.seed(24)
for x,y,scale in [(80,250,1.2),(165,325,.7),(365,73,.8),(1080,95,.9),(1270,290,1.1),(900,340,.8)]:
 svg+=f'<g transform="translate({x} {y}) scale({scale})" fill="#fffdf2" opacity=".69" filter="url(#cloud)">'
 for i in range(5):svg+=f'<ellipse cx="{i*28}" cy="{random.randint(-8,8)}" rx="{random.randint(23,40)}" ry="{random.randint(8,17)}"/>'
 svg+='</g>'
for lon,lat,zh,en in [(108.5,24.1,'广西','GUANGXI'),(114.4,24,'广东','GUANGDONG'),(109.7,18.9,'海南','HAINAN')]:
 x,y=project(lon,lat);svg+=f'<g fill="#5d7667" opacity=".75" text-anchor="middle" font-family="Georgia,serif"><text x="{x:.1f}" y="{y:.1f}" font-size="14" letter-spacing="4">{zh}</text><text x="{x:.1f}" y="{y+16:.1f}" font-size="8" letter-spacing="2">{en}</text></g>'
svg+='</g><ellipse cx="720" cy="525" rx="1000" ry="495" fill="none" stroke="#eff6ee" stroke-width="3" opacity=".8"/></g></svg>'
(root/'assets/ml/south-china.svg').write_text(svg)
print(f'{len(features)} regional polygons; {source.name}; {len(svg)} SVG characters')
