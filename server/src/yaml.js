import * as JSYaml from 'js-yaml';
import * as fs from 'fs';
import * as Config from './config';
export function parseProductFile(filename) {
    return JSYaml.safeLoad(fs.readFileSync(Config.homePath + Config.productFolder + filename));
}
//# sourceMappingURL=yaml.js.map