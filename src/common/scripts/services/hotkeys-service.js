/*global overwolf*/
import HOTKEYS from '../constants/hotkeys-ids';

/**
   * get a hotkey combination by hotkey id
   * @param hotkeyId
   * @param callback
   * @private
   */
  function _getHotkey(hotkeyId, callback) {
    overwolf.settings.getHotKey(hotkeyId, function (result) {
      if (!result || result.status === "error" || !result.hotkey) {
        console.log(result);
        setTimeout(function () {
          _getHotkey(hotkeyId, callback);
        }, 2000);
      } else {
        callback(result.hotkey);
      }
    });
  }

  /**
   * set custom action for a hotkey id
   * @param hotkeyId
   * @param action
   * @private
   */
  function _setHotkey(hotkeyId, action) {
    overwolf.settings.hotkeys.assign(hotkeyId, function (result) {
      if (result.status === 'success') {
        action();
      } else {
        console.error(`[HOTKEYS SERVICE] failed to register hotkey ${hotkeyId}`);
      }
    });
  }

  function getToggleHotkey() {
    return new Promise((resolve, reject) => {
      _getHotkey(HOTKEYS.TOGGLE, function (result) {
        resolve(result);
      });
    });
  }

  function setToggleHotkey(action) {
    _setHotkey(HOTKEYS.TOGGLE,action);
  }

  function addHotkeyChangeListener(listener) {
    overwolf.settings.hotkeys.onChanged.addListener(listener);
  }

  export default {
    getToggleHotkey,
    setToggleHotkey,
    addHotkeyChangeListener
  };