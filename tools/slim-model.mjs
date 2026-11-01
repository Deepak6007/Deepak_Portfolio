import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { weld, simplify, prune, dedup, join, flatten, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder,'meshopt.encoder':MeshoptEncoder});
const [src, out, ratio] = process.argv.slice(2);
const doc = await io.read(src);
const root = doc.getRoot();
// one plain material, no textures (the site paints the model)
const mat = doc.createMaterial('paint').setBaseColorFactor([0.55,0.6,0.75,1]).setMetallicFactor(0.4).setRoughnessFactor(0.3).setDoubleSided(true);
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { p.setMaterial(mat); for (const s of p.listSemantics()) if (s!=='POSITION' && s!=='NORMAL') p.setAttribute(s,null); }
for (const t of root.listTextures()) t.dispose();
await doc.transform(dedup(), flatten(), join(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: +ratio, error: +(process.argv[5]||0.001) }), prune(), meshopt({ encoder: MeshoptEncoder }));
await io.write(out, doc);
let t=0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) t+=p.getIndices().getCount()/3;
console.log(out.split('/').pop(), Math.round(t),'tris', root.listTextures().length,'textures', root.listMeshes().length,'meshes');
