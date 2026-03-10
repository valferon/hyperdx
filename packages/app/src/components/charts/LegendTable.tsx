import { memo, useCallback } from 'react';
import { ScrollArea } from '@mantine/core';

import type { NumberFormat } from '@/types';
import { formatNumber, truncateMiddle } from '@/utils';

import styles from '../../../styles/LegendTable.module.scss';

export interface SeriesStats {
  dataKey: string;
  displayName: string;
  color: string;
  isDashed?: boolean;
  min?: number;
  max?: number;
  avg?: number;
}

interface LegendTableProps {
  seriesStats: SeriesStats[];
  numberFormat?: NumberFormat;
  selectedSeriesNames?: Set<string>;
  onToggleSeries?: (name: string, isShiftKey?: boolean) => void;
}

function LegendTableComponent({
  seriesStats,
  numberFormat,
  selectedSeriesNames = new Set(),
  onToggleSeries,
}: LegendTableProps) {
  const hasSelection = selectedSeriesNames.size > 0;

  const formatValue = useCallback(
    (val?: number) => {
      if (val == null) return '-';
      return numberFormat
        ? formatNumber(val, numberFormat)
        : formatNumber(val, { output: 'number', factor: 1, mantissa: 2 });
    },
    [numberFormat],
  );

  return (
    <ScrollArea
      h="100%"
      type="auto"
      style={{ borderLeft: '1px solid var(--color-border)' }}
    >
      <table className={styles.legendTable}>
        <thead>
          <tr>
            <th className={styles.nameCol}></th>
            <th className={styles.statCol}>Min</th>
            <th className={styles.statCol}>Max</th>
            <th className={styles.statCol}>Avg</th>
          </tr>
        </thead>
        <tbody>
          {seriesStats.map(series => {
            const isSelected = selectedSeriesNames.has(series.displayName);
            const isDisabled = hasSelection && !isSelected;

            return (
              <tr
                key={series.dataKey}
                className={styles.row}
                style={{ opacity: isDisabled ? 0.3 : 1 }}
                onClick={e => {
                  onToggleSeries?.(series.displayName, e.shiftKey);
                }}
              >
                <td className={styles.nameCol}>
                  <div className={styles.nameCellContent}>
                    <span className={styles.colorIndicator}>
                      <svg width="12" height="4">
                        <line
                          x1="0"
                          y1="2"
                          x2="12"
                          y2="2"
                          stroke={series.color}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          strokeDasharray={series.isDashed ? '4 3' : '0'}
                        />
                      </svg>
                    </span>
                    <span
                      style={{
                        color: series.color,
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {truncateMiddle(series.displayName, 50)}
                    </span>
                  </div>
                </td>
                <td className={styles.statCol}>{formatValue(series.min)}</td>
                <td className={styles.statCol}>{formatValue(series.max)}</td>
                <td className={styles.statCol}>{formatValue(series.avg)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollArea>
  );
}

const LegendTable = memo(LegendTableComponent);
export default LegendTable;
