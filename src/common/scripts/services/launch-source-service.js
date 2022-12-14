/**
 * Detects the launch source of the app (manual or automatic from game launch)
 * gamelaunchevent source means the app was autolaunched with the game
 */

let _launchSource = _detectLaunchSource();

function _detectLaunchSource() {
  let source = _getUrlParameterByName('source');
  return source;
}

function _getUrlParameterByName(name) {
  let regex, results;
  // name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

class LaunchSourceService {
  static getLaunchSource() {
    return _launchSource;
  }
}

export default LaunchSourceService;