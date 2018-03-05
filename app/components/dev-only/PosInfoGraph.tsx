import { FireEstimate, getPosInfoArray, getTankT } from 'ai/shortest-path'
import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { State } from 'types'

let connectedPosInfoGraph: any = () => null as any

if (DEV) {
  const colors = {
    red: '#ff0000b3',
    green: '#4caf50aa',
    orange: 'orange',
  }

  class PosInfoGraph extends React.PureComponent<State> {
    render() {
      const { map } = this.props
      const posInfoArray = getPosInfoArray(map)
      let estMap = new Map<number, FireEstimate>()
      if (map.eagle) {
        estMap = posInfoArray[getTankT(map.eagle)].getIdealFireEstMap(map)
      }
      return (
        <g className="pos-info-graph">
          {posInfoArray.map((posInfo, t) => {
            const row = Math.floor(t / 26)
            const col = t % 26
            if (row === 0 || col === 0) {
              return null
            }
            const est = estMap.get(t)
            const brickCount = est ? est.brickCount : ''
            return (
              <g key={t}>
                <circle
                  key={t}
                  cx={8 * col}
                  cy={8 * row}
                  r={1.5}
                  fill={posInfo.canPass ? (est ? colors.orange : colors.green) : colors.red}
                />
                <text x={8 * col} y={8 * row} dx={1.5} dy={1} fill="white" fontSize="4">
                  {brickCount}
                </text>
              </g>
            )
          })}
        </g>
      )
    }
  }

  connectedPosInfoGraph = connect<State>(_.identity)(PosInfoGraph)
}

export default connectedPosInfoGraph