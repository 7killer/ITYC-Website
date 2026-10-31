import type { InteractiveLineChartProps, LineSeries } from './InteractiveLineChart'

const xValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
const reference = [0, 2.4, 5.1, 7.5, 8.8, 10.6, 11.4, 10.9, 12.8, 15.1, 14.4]
const performance = [0, 2.1, 5.3, 7.8, 8.6, 10.8, 12.1, 11.5, 13.1, 14.7, 15.3]
const alternative = [0, 1.8, 4.7, 7.1, 8.2, 10.2, 11.7, 11.2, 12.6, 14.2, 15.0]

function points(values: readonly number[], offset = 0) {
  return xValues.map((x, index) => ({ x, y: values[index] + offset }))
}

function seriesFor(index: number): LineSeries[] {
  const offset = (index % 3) * .35
  return [
    { color: '#ffc107', dash: [6, 7], id: 'reference', label: 'Référence', points: points(reference, offset) },
    {
      color: '#00a000',
      id: 'performance',
      label: 'Performance',
      points: points(performance, offset),
      segment: (segmentIndex) => segmentIndex > 6 ? { color: '#0000ff' } : undefined,
    },
    { color: '#f67876', dash: [2, 4], id: 'alternative', label: 'Alternative', points: points(alternative, offset) },
  ]
}

export function getMockPolarChart(index: number): InteractiveLineChartProps {
  return {
    cursor: index % 2 === 0 ? 'vertical' : 'cross',
    series: seriesFor(index),
    xAxis: { label: index === 1 ? 'True Wind Speed' : 'True Wind Angle', unit: index === 1 ? 'nds' : '°' },
    yAxis: { label: 'Vitesse bateau', unit: 'nds' },
    zoom: 'x',
  }
}
