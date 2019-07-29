import { forOwn } from "lodash";

interface Textures {
  [key: string]: Texture;
}

interface Texture {
  url: string;
  image?: HTMLImageElement;
}

export class TextureLoader {
  private textureResourcesDict: Textures = {};

  public registerTextures(dict: Textures) {
    this.textureResourcesDict = {
      ...this.textureResourcesDict,
      ...dict
    };
  }

  public getTexture(id: string) {
    return this.textureResourcesDict[id];
  }

  public loadTextures(): Promise<Textures> {
    if (typeof document !== "undefined") {
      const loadPromises: Promise<Texture>[] = [];

      forOwn(this.textureResourcesDict, tex => {
        if (!tex.image) {
          const loadPromise = new Promise<Texture>((resolve, reject) => {
            tex.image = document.createElement("img");
            tex.image.onload = () => resolve(tex);
            tex.image.onerror = () =>
              reject(`Failed to load texture: ${tex.url}`);
            tex.image.src = tex.url;
          });

          loadPromises.push(loadPromise);
        }
      });

      return Promise.all(loadPromises).then(() => this.textureResourcesDict);
    }
  }
}
