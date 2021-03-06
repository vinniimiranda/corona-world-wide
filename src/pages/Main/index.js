import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';

import api from './../../services/api';

import Loading from '../../components/Loading';

// am4core.useTheme(am4themes_animated);

const colors = {
  primary: '#01DBCC',
  background: '#000014',
  text: '#fff',
};
export default function Main () {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [stats, setStats] = useState(null)
  useEffect(() => {
    async function loadData () {
      api.get('/countries').then(({ data: resData }) => {
        setData(resData)
        setLoading(false)
      });
    }

    async function loadStats () {
      api.get('stats').then(({ data: resData }) => setStats(resData));
    }

    loadStats();
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const chart = am4core.create('chartdiv', am4maps.MapChart);

      try {
        chart.geodata = am4geodata_worldLow;
      } catch (e) {
        chart.raiseCriticalError(
          new Error(
            'Map geodata could not be loaded. Please download the latest <a href="https://www.amcharts.com/download/download-v4/">amcharts geodata</a> and extract its contents into the same directory as your amCharts files.'
          )
        );
      }

      const label = chart.createChild(am4core.Label);
      label.text = `World Wide Coronavirus Stats
      Total cases: ${stats.total_cases}
      Total deaths: ${stats.total_deaths}
      Total new cases today: ${stats.total_new_cases_today}
      Total new deaths today: ${stats.total_new_deaths_today}
`;
      label.fontSize = '1rem';
      label.fontWeight = 'bold';
      label.align = 'left';
      label.valign = 'bottom';
      label.fill = am4core.color(colors.primary);
      label.background = new am4core.RoundedRectangle();
      label.background.cornerRadius(10, 10, 10, 10);
      label.padding(10, 10, 10, 10);
      label.marginLeft = 30;
      label.marginBottom = 30;
      label.background.strokeOpacity = 0.3;
      label.background.stroke = am4core.color(colors.primary);
      label.background.strokeWidth = 2;
      label.background.fill = am4core.color('#000014');
      label.background.fillOpacity = 0.6;

      const dataSource = chart.createChild(am4core.TextLink);
      dataSource.text = 'Data source: Coronavirus Tracker API';
      dataSource.fontSize = '1rem';
      dataSource.fontWeight = 'bold';
      dataSource.align = 'left';
      dataSource.valign = 'top';
      dataSource.url = 'https://thevirustracker.com/api';
      dataSource.urlTarget = '_blank';
      dataSource.fill = am4core.color(colors.primary);
      dataSource.padding(10, 10, 10, 10);
      dataSource.marginLeft = 30;
      dataSource.marginTop = 30;

      // Set projection
      chart.projection = new am4maps.projections.Orthographic();
      chart.panBehavior = 'rotateLongLat';
      chart.deltaLatitude = -200;
      chart.padding(20, 20, 20, 20);

      // limits vertical rotation
      chart.adapter.add('deltaLatitude', function (delatLatitude) {
        return am4core.math.fitToRange(delatLatitude, -90, 90);
      });

      let animation;
      setTimeout(function () {
        animation = chart.animate({ property: "deltaLongitude", to: 100000 }, 20000000);
      }, 3000)
      chart.seriesContainer.events.on("down", function () {
        if (animation) {
          animation.stop();
        }
      })


      // Add zoom control
      chart.zoomControl = new am4maps.ZoomControl();

      const homeButton = new am4core.Button();
      homeButton.events.on('hit', function () {
        chart.goHome();
      });

      homeButton.icon = new am4core.Sprite();
      homeButton.padding(7, 5, 7, 5);
      homeButton.width = 30;
      homeButton.icon.path =
        'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
      homeButton.marginBottom = 10;
      homeButton.parent = chart.zoomControl;
      homeButton.insertBefore(chart.zoomControl.plusButton);

      chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
        '#000014'
      );
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;
      chart.deltaLongitude = 60;
      chart.deltaLatitude = 0;

      // limits vertical rotation
      chart.adapter.add('deltaLatitude', function (delatLatitude) {
        return am4core.math.fitToRange(delatLatitude, -90, 90);
      });

      // Create map polygon series

      const shadowPolygonSeries = chart.series.push(
        new am4maps.MapPolygonSeries()
      );
      shadowPolygonSeries.geodata = am4geodata_continentsLow;

      try {
        shadowPolygonSeries.geodata = am4geodata_continentsLow;
      } catch (e) {
        shadowPolygonSeries.raiseCriticalError(
          new Error(
            'Map geodata could not be loaded. Please download the latest <a href="https://www.amcharts.com/download/download-v4/">amcharts geodata</a> and extract its contents into the same directory as your amCharts files.'
          )
        );
      }

      shadowPolygonSeries.useGeodata = true;
      shadowPolygonSeries.dx = 2;
      shadowPolygonSeries.dy = 2;
      shadowPolygonSeries.mapPolygons.template.fill = am4core.color('#fff');
      shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
      shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
      shadowPolygonSeries.fillOpacity = 0.1;
      shadowPolygonSeries.fill = am4core.color('#fff');

      // Create map polygon series
      const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;

      polygonSeries.calculateVisualCenter = true;
      polygonSeries.tooltip.background.fillOpacity = 0.8;
      polygonSeries.tooltip.label.fill = am4core.color('#fff');
      polygonSeries.tooltip.background.cornerRadius = 20;

      const template = polygonSeries.mapPolygons.template;
      template.nonScalingStroke = true;
      template.fill = am4core.color(colors.primary);
      template.stroke = am4core.color(colors.primary);

      polygonSeries.calculateVisualCenter = true;
      template.propertyFields.id = 'id';
      template.tooltipPosition = 'fixed';
      template.fillOpacity = 0.5;

      template.events.on('over', function (event) {
        if (event.target.dummyData) {
          event.target.dummyData.isHover = true;
        }
      });
      template.events.on('out', function (event) {
        if (event.target.dummyData) {
          event.target.dummyData.isHover = false;
        }
      });

      const hs = polygonSeries.mapPolygons.template.states.create('hover');
      hs.properties.fillOpacity = 1;
      hs.properties.fill = am4core.color(colors.primary);

      const graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
      graticuleSeries.mapLines.template.stroke = am4core.color('#fff');
      graticuleSeries.fitExtent = false;
      graticuleSeries.mapLines.template.strokeOpacity = 0.2;
      graticuleSeries.mapLines.template.stroke = am4core.color('#fff');

      const measelsSeries = chart.series.push(new am4maps.MapPolygonSeries());
      measelsSeries.tooltip.background.fillOpacity = 0.8;
      measelsSeries.tooltip.background.fill = am4core.color('#fff');
      measelsSeries.tooltip.background.cornerRadius = 20;
      measelsSeries.tooltip.autoTextColor = false;
      measelsSeries.tooltip.label.fill = am4core.color('#fff');
      measelsSeries.tooltip.dy = -5;

      const measelTemplate = measelsSeries.mapPolygons.template;
      measelTemplate.fill = am4core.color('#aa0000');
      measelTemplate.strokeOpacity = 0;
      measelTemplate.fillOpacity = 0.75;
      measelTemplate.tooltipPosition = 'fixed';
      // measelTemplate.animate({property: "fillOpacity", from: 0, to:1 }, 1000)

      const hs2 = measelsSeries.mapPolygons.template.states.create('hover');
      hs2.properties.fillOpacity = 1;
      hs2.properties.fill = am4core.color('#ff0000');

      polygonSeries.events.on('inited', function () {
        polygonSeries.mapPolygons.each(function (mapPolygon) {
          const count = data[mapPolygon.id] ? data[mapPolygon.id].cases : 0;
          const deaths = data[mapPolygon.id] ? data[mapPolygon.id].deaths : 0;
          const today = data[mapPolygon.id] ? data[mapPolygon.id].today : 0;

          if (count > 0) {
            const polygon = measelsSeries.mapPolygons.create();
            polygon.multiPolygon = am4maps.getCircle(
              mapPolygon.visualLongitude,
              mapPolygon.visualLatitude,
              Math.max(0.2, (Math.log(count) * Math.LN10) / 10)
            );
            polygon.tooltipText = `${mapPolygon.dataItem.dataContext.name}
            Confirmed cases: ${count}
            Today cases: ${today}
            Deaths: ${deaths}
            `;
            mapPolygon.dummyData = polygon;
            polygon.events.on('over', function () {
              mapPolygon.isHover = true;
            });
            polygon.events.on('out', function () {
              mapPolygon.isHover = false;
            });
          } else {
            mapPolygon.tooltipText =
              mapPolygon.dataItem.dataContext.name + ': no data';
            mapPolygon.fillOpacity = 0.3;
          }
        });
      });
    }

    //eslint-disable-next-line
  }, [loading, data]);

  return (
    <div id="chartdiv" style={{ width: '100%', height: '100vh' }}>
      {loading && <Loading />}
    </div>
  );
}
