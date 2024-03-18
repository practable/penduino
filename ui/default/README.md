# penduino-ui

User interface for the [penduino](https://github.com/practable/penduino) remote lab.

Originally based upon ['penduino-ui'](https://github.com/timdrysdale/penduino-ui) by Tim Drysdale


## New for Version 3.

- chat widget and corresponding vuex state added
- Dark and light themes available
- Updated CSS
- Accessibility updates including aria-labels for screen readers, visible highlighting of components on tab and improved contrast ratios
- Minimum input size
- Keyboard input for hardware modes and recording data
- Recorded data has an associated dataset.
- Table displays data in separate datasets
- Download CSV generates separate files for each dataset, added a timestamp to the filename
- Graph now plots colour according to dataset, so this is retained on change of graphed variable or change between light/dark mode
- Popups use modals now
- Moving components highlights the position a component is moving to
- Updated initial component layout based on screen size
- stored user ID now uses the practable userName rather than generating a new one
- session end image src updated to reflect new server
- Snapshot tool now stores data without adding to the recorded data set, this removes issues with data adding to graph
- Updated the low pass filter for smoothie data to reduce drift and added a constant 200ms delay to ensure recorded data appears smoothly generated no matter the sampling rate.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

