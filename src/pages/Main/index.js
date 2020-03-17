import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldHigh';
import am4geodata_continentsLow from '@amcharts/amcharts4-geodata/continentsLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import api from './../../services/api';

import loadingIMG from '../../assets/loading.png'
import Loading from '../../components/Loading';
// am4core.useTheme(am4geodata_worldLow);
am4core.useTheme(am4themes_animated);

export default function Main() {
  var paises = [
    'AL',
    'AM',
    'AO',
    'AR',
    'AT',
    'AU',
    'AZ',
    'BA',
    'BD',
    'BE',
    'BF',
    'BG',
    'BI',
    'BJ',
    'BR',
    'BT',
    'BY',
    'CA',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CL',
    'CM',
    'CN',
    'CO',
    'CY',
    'CZ',
    'DK',
    'EE',
    'EG',
    'ES',
    'FI',
    'FR',
    'GA',
    'GB',
    'GE',
    'GH',
    'GM',
    'GN',
    'GQ',
    'GR',
    'HR',
    'HU',
    'ID',
    'IE',
    'IL',
    'IN',
    'IQ',
    'IR',
    'IT',
    'JP',
    'KE',
    'KG',
    'KH',
    'KM',
    'KZ',
    'LA',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'MA',
    'MD',
    'ME',
    'MG',
    'MK',
    'ML',
    'MM',
    'MN',
    'MR',
    'MT',
    'MV',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NE',
    'NG',
    'NL',
    'NO',
    'NP',
    'NZ',
    'PE',
    'PK',
    'PL',
    'PT',
    'RO',
    'RS',
    'RU',
    'RW',
    'SE',
    'SG',
    'SI',
    'SK',
    'SN',
    'SO',
    'SS',
    'TD',
    'TG',
    'TH',
    'TL',
    'TN',
    'TR',
    'UA',
    'UG',
    'US',
    'UZ',
    'VE',
    'ZA',
    'ZM',
    'ZW',
  ];
  const payload = {};
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  useEffect(() => {
    async function loadData({ pais }) {
      api({
        params: {
          countryTotal: pais,
        },
      }).then(res => {
        try {
          payload[pais] = res.data.countrydata[0].total_cases;
          if (Object.keys(payload).length === 112) {
            setData(payload);
            setLoading(false);
          }
        } catch (error) {}
      });
    }
    for (const pais of paises) {
      loadData({ pais });
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      var chart = am4core.create('chartdiv', am4maps.MapChart);
      var interfaceColors = new am4core.InterfaceColorSet();

      try {
        chart.geodata = am4geodata_worldLow;
      } catch (e) {
        chart.raiseCriticalError(
          new Error(
            'Map geodata could not be loaded. Please download the latest <a href="https://www.amcharts.com/download/download-v4/">amcharts geodata</a> and extract its contents into the same directory as your amCharts files.'
          )
        );
      }

      var label = chart.createChild(am4core.Label);
      label.text =
        "12 months (3/7/2019 data) rolling measles\nincidence per 1'000'000 total population. \n Bullet size uses logarithmic scale.";
      label.fontSize = 12;
      label.align = 'left';
      label.valign = 'bottom';
      label.fill = am4core.color('#01DBCC');
      label.background = new am4core.RoundedRectangle();
      label.background.cornerRadius(10, 10, 10, 10);
      label.padding(10, 10, 10, 10);
      label.marginLeft = 30;
      label.marginBottom = 30;
      label.background.strokeOpacity = 0.3;
      label.background.stroke = am4core.color('#01DBCC');
      label.background.strokeWidth = 2;
      label.background.fill = am4core.color('#000014');
      label.background.fillOpacity = 0.6;

      var dataSource = chart.createChild(am4core.TextLink);
      dataSource.text = 'Data source: Coronavirus Tracker API';
      dataSource.fontSize = 12;
      dataSource.align = 'left';
      dataSource.valign = 'top';
      dataSource.url =
        'https://thevirustracker.com/api';
      dataSource.urlTarget = '_blank';
      dataSource.fill = am4core.color('#01DBCC');
      dataSource.padding(10, 10, 10, 10);
      dataSource.marginLeft = 30;
      dataSource.marginTop = 30;

      // Set projection
      // Set projection
      chart.projection = new am4maps.projections.Orthographic();
      chart.panBehavior = 'rotateLongLat';
      chart.deltaLatitude = -20;
      chart.padding(20, 20, 20, 20);

      // limits vertical rotation
      chart.adapter.add('deltaLatitude', function(delatLatitude) {
        return am4core.math.fitToRange(delatLatitude, -90, 90);
      });

      // Add zoom control
      chart.zoomControl = new am4maps.ZoomControl();

      var homeButton = new am4core.Button();
      homeButton.events.on('hit', function() {
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
      chart.deltaLongitude = 20;
      chart.deltaLatitude = -20;

      // limits vertical rotation
      chart.adapter.add('deltaLatitude', function(delatLatitude) {
        return am4core.math.fitToRange(delatLatitude, -90, 90);
      });

      // Create map polygon series

      var shadowPolygonSeries = chart.series.push(
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
      var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;

      polygonSeries.calculateVisualCenter = true;
      polygonSeries.tooltip.background.fillOpacity = 0.8;
      polygonSeries.tooltip.label.fill = am4core.color('#fff');
      polygonSeries.tooltip.background.cornerRadius = 20;

      var template = polygonSeries.mapPolygons.template;
      template.nonScalingStroke = true;
      template.fill = am4core.color('#01DBCC');
      template.stroke = am4core.color('#01DBCC');

      polygonSeries.calculateVisualCenter = true;
      template.propertyFields.id = 'id';
      template.tooltipPosition = 'fixed';
      template.fillOpacity = 0.5;

      template.events.on('over', function(event) {
        if (event.target.dummyData) {
          event.target.dummyData.isHover = true;
        }
      });
      template.events.on('out', function(event) {
        if (event.target.dummyData) {
          event.target.dummyData.isHover = false;
        }
      });

      var hs = polygonSeries.mapPolygons.template.states.create('hover');
      hs.properties.fillOpacity = 1;
      hs.properties.fill = am4core.color('#01DBCC');

      var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
      graticuleSeries.mapLines.template.stroke = am4core.color('#fff');
      graticuleSeries.fitExtent = false;
      graticuleSeries.mapLines.template.strokeOpacity = 0.2;
      graticuleSeries.mapLines.template.stroke = am4core.color('#fff');

      var measelsSeries = chart.series.push(new am4maps.MapPolygonSeries());
      measelsSeries.tooltip.background.fillOpacity = 0.8;
      measelsSeries.tooltip.background.fill = am4core.color('#fff');
      measelsSeries.tooltip.background.cornerRadius = 20;
      measelsSeries.tooltip.autoTextColor = false;
      measelsSeries.tooltip.label.fill = am4core.color('#fff');
      measelsSeries.tooltip.dy = -5;

      var measelTemplate = measelsSeries.mapPolygons.template;
      measelTemplate.fill = am4core.color('#aa0000');
      measelTemplate.strokeOpacity = 0;
      measelTemplate.fillOpacity = 0.75;
      measelTemplate.tooltipPosition = 'fixed';

      var hs2 = measelsSeries.mapPolygons.template.states.create('hover');
      hs2.properties.fillOpacity = 1;
      hs2.properties.fill = am4core.color('#ff0000');

      polygonSeries.events.on('inited', function() {
        polygonSeries.mapPolygons.each(function(mapPolygon) {
          var count = data[mapPolygon.id];

          if (count > 0) {
            var polygon = measelsSeries.mapPolygons.create();
            polygon.multiPolygon = am4maps.getCircle(
              mapPolygon.visualLongitude,
              mapPolygon.visualLatitude,
              Math.max(0.2, (Math.log(count) * Math.LN10) / 10)
            );
            polygon.tooltipText = `${mapPolygon.dataItem.dataContext.name}: ${count} cases`;
            mapPolygon.dummyData = polygon;
            polygon.events.on('over', function() {
              mapPolygon.isHover = true;
            });
            polygon.events.on('out', function() {
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
  }, [loading]);

  return <div id="chartdiv" style={{ width: '100%', height: '100vh' }}>
    {loading && <Loading /> }
  </div>;
}
