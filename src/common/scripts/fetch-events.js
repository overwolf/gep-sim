fetch(`https://game-events-status.overwolf.com/gamestatus_prod.json`)
  .then(response => response.json())
  .then(response => {

    const features = [];
    const events = [];
    const infoUpdates = [];

    for (let feature of response.features) {
      features.push(feature.name);
      for (let key of feature.keys) {
        if (key.type === 1) { // if (key.category)
          infoUpdates.push(key.name);
        }
        else {
          events.push(key.name);
        }
      }
    }

    const featureSelect = document.getElementById("feature-select");
    setOptions(featureSelect, features);
  })