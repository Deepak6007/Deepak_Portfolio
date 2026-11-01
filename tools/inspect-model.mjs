import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/core';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); const root = doc.getRoot();
  const sc = root.listScenes()[0];
  console.log(f.split('/').pop(), 'scene bounds', JSON.stringify(getBounds(sc)));
  console.log(' meshes', root.listMeshes().length, 'materials', root.listMaterials().map(m=>m.getName()+':'+m.getBaseColorFactor().map(x=>x.toFixed(2)).join(',')).slice(0,12).join(' | '));
  for (const n of root.listNodes().filter(n=>n.getMesh()).slice(0,40)) { try{ const b=getBounds(n); const s=b.max.map((v,i)=>(v-b.min[i]).toFixed(2)); console.log('  ', n.getName().slice(0,30), s.join('x')); }catch(e){} }
}
