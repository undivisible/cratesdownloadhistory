import { describe, expect, test } from 'bun:test';
import { aggregateDownloads } from './chart';
import { escapeHtmlAttr, escapeXml } from './escape';
import { parseWidgetOptions } from './widget';
import type { VersionDownload } from './types';

describe('aggregateDownloads', () => {
  test('sums daily across crates and builds cumulative backward', () => {
    const histories: VersionDownload[][] = [
      [
        { version: 1, downloads: 10, date: '2024-01-01' },
        { version: 1, downloads: 5, date: '2024-01-02' },
      ],
      [{ version: 1, downloads: 7, date: '2024-01-02' }],
    ];
    const points = aggregateDownloads(histories, 100);
    expect(points).toHaveLength(2);
    expect(points[0]).toEqual({ date: '2024-01-01', daily: 10, cumulative: 88 });
    expect(points[1]).toEqual({ date: '2024-01-02', daily: 12, cumulative: 100 });
  });
});

describe('parseWidgetOptions', () => {
  test('allowlists theme and aliases date', () => {
    const p = parseWidgetOptions(new URLSearchParams('theme=notreal&date=iso&crates=1'));
    expect(p.theme).toBe('light');
    expect(p.dateFormat).toBe('ymd');
    expect(p.showCrates).toBe(true);
  });
});

describe('escape', () => {
  test('escapeXml and escapeHtmlAttr', () => {
    expect(escapeXml(`a&b<"c>`)).toBe('a&amp;b&lt;&quot;c&gt;');
    expect(escapeHtmlAttr(`it's "ok"`)).toBe('it&#39;s &quot;ok&quot;');
  });
});