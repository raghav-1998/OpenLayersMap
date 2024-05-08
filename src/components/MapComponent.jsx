//import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import './MapComponent.css';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { useEffect, useState } from 'react';
import {Draw} from 'ol/interaction';
import { Feature } from 'ol';
import { Circle, Point } from 'ol/geom';
import Style from 'ol/style/Style';
import RegularShape from 'ol/style/RegularShape';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { fromLonLat } from 'ol/proj';

const MapComponent=()=>{
    //const [map,setMap]=useState(null);
    const [drawType, setDrawType] = useState('Point');
    const [drawInteraction, setDrawInteraction] = useState(null);

    const [map]=useState(new Map({
        target:"map",
        layers:[
            new TileLayer({
                source:new OSM()
            })
        ],
        view:new View({
            center:fromLonLat([0,0]),
            zoom:2
        })
    }));

    const vectorSource=new VectorSource();
    const vectorLayer=new VectorLayer({
        source:vectorSource
    });

    map.addLayer(vectorLayer);

    useEffect(()=>{

        const addReverseTearDropMarker=(event)=>{
            const reverseTearDropStyle=createReverseTearDropStyle('red')
            const coordinate=event.coordinate
            const feature=new Feature({
                geometry: new Point(coordinate)
            })
            feature.setStyle(reverseTearDropStyle);
            vectorSource.clear()
            vectorSource.addFeature(feature)
        };

        
        map.on('click',addReverseTearDropMarker);

    },[map])

    useEffect(()=>{
        if(map){
            if(drawInteraction){
                map.removeInteraction(drawInteraction)
            }
    
            const newDrawInteraction = new Draw({
                source: vectorSource, // Assumes the vector layer is always the second layer
                type: drawType,
                style: new Style({
                  fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                  }),
                  stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2,
                  }),
                }),
            });
    
            map.addInteraction(newDrawInteraction);
            setDrawInteraction(newDrawInteraction);
    
        }
    },[drawType,drawInteraction,map,vectorSource])


    const createReverseTearDropStyle=(color)=>{
        return new Style({
            image: new RegularShape({
                fill:new Fill({color:color}),
                stroke:new Stroke({color:'black',width:2}),
                points:3,
                radius:10,
                radius2:4,
                angle:Math.PI
            })
        })
    }

    
        /*
        const createReverseTearDropStyle=(color)=>{
            return new Style({
                image: new RegularShape({
                    fill:new Fill({color:color}),
                    stroke:new Stroke({color:'black',width:2}),
                    points:3,
                    radius:10,
                    radius2:4,
                    angle:Math.PI
                })
            })
        }

        const addReverseTearDropMarker=(event)=>{
            const reverseTearDropStyle=createReverseTearDropStyle('red')
            const coordinate=event.coordinate
            const feature=new Feature({
                geometry: new Point(coordinate)
            })
            feature.setStyle(reverseTearDropStyle);
            vectorSource.addFeature(feature)
        }

        console.log(map.on('click',addReverseTearDropMarker))

        
        return ()=>{
            //map.un('click')
        };*/

    const handleDrawTypeChange=(event)=>{
        setDrawType(event.target.value)
    }
    
    return (
        <div>
            <div>
                <label htmlFor="type">
                Draw Type:{' '}
                </label>
                <select id='type'value={drawType} onChange={handleDrawTypeChange}>
                    <option value="Point">Point</option>
                    <option value="LineString">Line</option>
                    <option value="Polygon">Polygon</option>
                </select>

            </div>
            <div id="map"></div>
        </div>
        
    )
}

export default MapComponent