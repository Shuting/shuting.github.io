"""Render a flat South China coastline from the existing Natural Earth subset."""
from pathlib import Path
import json

root=Path(__file__).resolve().parents[1]
data=json.loads((root/'data/south-china-land.geojson').read_text())

def clip(poly,axis,bound,greater):
    if not poly:return []
    result=[];a=poly[-1]
    inside=lambda p:p[axis]>=bound if greater else p[axis]<=bound
    for b in poly:
        if inside(a)!=inside(b):
            t=(bound-a[axis])/(b[axis]-a[axis])
            result.append([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])])
        if inside(b):result.append(b)
        a=b
    return result

paths=[]
for feature in data['features']:
    geo=feature['geometry']
    polys=geo['coordinates'] if geo['type']=='MultiPolygon' else [geo['coordinates']]
    for poly in polys:
        for ring in poly:
            for axis,limit,greater in [(0,105,True),(0,119,False),(1,17,True),(1,26,False)]:
                ring=clip(ring,axis,limit,greater)
            if len(ring)>2:
                paths.append('M'+'L'.join(f'{(x-105)*760/14:.1f},{(26-y)*430/9:.1f}' for x,y in ring)+'Z')
(root/'data/multimodal-coast.js').write_text('// Natural Earth 1:50m land, public domain; geographic context only.\nexport const southChinaPath = '+json.dumps(' '.join(paths))+';\n')
print(f'Built {len(paths)} coastal rings.')
