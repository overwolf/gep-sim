/*global overwolf*/

class Utils {
  /**
   * Change window position
   * @returns {Promise<*>}
   */
  static async getMonitorsList() {
    return new Promise(async (resolve, reject) => {
      try {
        overwolf.utils.getMonitorsList((result) => {
          resolve(result.displays);
        })
      } catch (e){
        reject(e);
      }
    });
  }
}

export default Utils;