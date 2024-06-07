     require([ 
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/ScaleBar",
        "esri/widgets/Legend",
        "esri/widgets/Search",
        "esri/widgets/Locate",
        "esri/widgets/Compass",
        "esri/geometry/Extent",
        "esri/widgets/FeatureTable",
        "esri/layers/FeatureLayer",
        "esri/renderers/UniqueValueRenderer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/widgets/Popup",
        "esri/widgets/LayerList"
      ], function(esriConfig, Map, MapView, ScaleBar, Legend, Search, Locate, Compass, Extent, FeatureTable, FeatureLayer,UniqueValueRenderer,SimpleMarkerSymbol,Popup,LayerList) {
        esriConfig.apiKey = "AAPK3fb425d3e32d4274908378b91b7b4b1e_SVq4iqQkTJmgzBx09upjG-EXOPSrlsQktStW4xAGCxQ_SsT1ImqA6Ib0WVioTbE";

        const map = new Map({
          basemap: "arcgis/imagery",
          ground: "world-elevation",
        });

        const serbiaExtent = new Extent({
          xmin: 18.8293,
          ymin: 42.2450,
          xmax: 23.0067,
          ymax: 46.1817,
          spatialReference: {
            wkid: 4326
          }
        });

        const view = new MapView({
          container: "viewDiv", 
          map: map,
          extent: serbiaExtent,
        });
   
        let compass = new Compass({
          view: view
        });

        view.ui.add(compass, "top-left");

        const locate = new Locate({
          view: view,
          useHeadingEnabled: false,
          goToOverride: function(view, options) {
            options.target.scale = 1500;
            return view.goTo(options.target);
          }
        });

        view.ui.add(locate, "top-left");

        
        const popup = new Popup({
           view: view,
          defaultPopupTemplateEnabled: true
            });
        
        view.popup = popup;

        
        const search = new Search({
          view: view
        });

        const scalebar = new ScaleBar({
          view: view
        });

        view.ui.add(scalebar, "bottom-left");

        view.ui.add(search, "bottom-left");

        const labelClass = {
          // autocasts as new LabelClass()
          symbol: {
            type: "text", // autocasts as new TextSymbol()
            color: "yellow",
            font: {
              // autocast as new Font()
              family: "Playfair Display",
              size: 12,
              weight: "bold"
            }
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.broj_parcele"
          }
        };
     
        const featureLayer = new FeatureLayer({
        portalItem: {
          id: "30bc4ef699384744b3be95f140ec179f"
        },
        renderer: createUniqueValueRenderer(),
        labelingInfo: [labelClass],
          popupTemplate: {
            title: "{Projektant}",
            content: "ID:{ID}<br> Elaborat: {Elaborat}<br>Datum: {Datum}<br>Projektant: {Projektant}<br>Broj parcele: {broj_parcele}<br>Katastarska opština: {Katastarska_opstina}<br>Investitor: {Investitor}"
  }
      });
      const featureLayer2 = new FeatureLayer({
        portalItem: {
          id: "20c5a76120344072beb1585516eb3538",
        },
        renderer: createUniqueValueRenderer2(),
      });
      map.add(featureLayer2);


      const layerList = new LayerList({
          view: view,
          listItemCreatedFunction: (event) => {
            const item = event.item;
            if (item.layer.type != "group") {
              // don't show legend twice
              item.panel = {
                content: "legend",
                open: false
              };
            }
          }
        });
        view.ui.add(layerList, "top-right");
 

        function createUniqueValueRenderer2() {
        return new UniqueValueRenderer({
          field: "tip",
          uniqueValueInfos: [
            { value: "J1", symbol: createSymbol("blue") },
            { value: "J2", symbol: createSymbol("blue") },
            { value: "J3", symbol: createSymbol("blue") },
            { value: "J4", symbol: createSymbol("blue") },
            { value: "obj", symbol: createSymbol("blue") },
            { value: "bus", symbol: createSymbol("red") },
          ],
          defaultSymbol: createSymbol([255,74,245])
        });
      }
      function createUniqueValueRenderer() {
        return new UniqueValueRenderer({
          field: "Projektant",
          uniqueValueInfos: [
            { value: "Dusan Katic", symbol: createSymbol("red") },
            { value: "Ivica Ivandic", symbol: createSymbol("blue") },
            { value: "Jelena Ivanovic Bartul", symbol: createSymbol("green") },
            { value: "Aleksandar Stoiljkovic", symbol: createSymbol("yellow") },
            { value: "Anka Milic", symbol: createSymbol("orange") },
            { value: "Igor Stefanovic", symbol: createSymbol("black") },
            { value: "Dimitrije Gajin", symbol: createSymbol("purple") },
            { value: "Snezana Paunovic", symbol: createSymbol([113,250,205]) },
            { value: "Bojan Stanivuk", symbol: createSymbol([113,250,205]) },
          ],
          defaultSymbol: createSymbol([255,74,245])
        });
      }

      function createSymbol(color) {
        return new SimpleMarkerSymbol({
          color: color,
          size: "8px",
          outline: {
            color: "black",
            width: 1
          }
        });
      }
        map.add(featureLayer);

        const featureTable = new FeatureTable({
          view: view,
          layer: featureLayer,
          multiSortEnabled: true,
          editingEnabled: true,
          tableTemplate: {
            columnTemplates: [
            {
                type: "field",
                fieldName: "ID",
                label: "ID"
              },
              {
                type: "field",
                fieldName: "Elaborat",
                label: "Elaborat"
              },
              {
                type: "field",
                fieldName: "Datum",
                label: "Datum"
              },
              {
                type: "field",
                fieldName: "Projektant",
                label: "Projektant"
              },
              {
                type: "field",
                fieldName: "broj_parcele",
                label: "Broj parcele"
              },
              {
                type: "field",
                fieldName: "Katastarska_opstina",
                label: "Katastarska opština"
              },
              {
                type: "field",
                fieldName: "Investitor",
                label: "Investitor"
              },
            ]
          },
          container: document.getElementById("tableDiv")
        });

        view.ui.add(featureTable, "bottom");

        const basemapStylesDiv = document.getElementById("basemapStyles");
        view.ui.add(basemapStylesDiv, "bottom-right");

        const styleCombobox = document.getElementById("styleCombobox");
        styleCombobox.addEventListener("calciteComboboxChange", (event) => {
          updateBasemapStyle(event.target.value);
        });

        function updateBasemapStyle(basemapId) {
          view.map.basemap = basemapId;
        }

      });
