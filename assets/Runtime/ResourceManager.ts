import { resources, SpriteFrame } from 'cc';
import Singleton from '../Base/Singleton';

export class ResourceManager extends Singleton {

    static get instance() {
      return super.getInstance<ResourceManager>();
    }

    // texture/tile/tile
    loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(path, type ,(err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            })
        })
    }

}

const ResourceManagerInstance = ResourceManager.instance

export default ResourceManagerInstance;
