import { a2ui } from '@/catalog/skill'
import { SandboxApi } from './sandbox'

a2ui.skill(SandboxApi, {
  example: () => ({
    id: 'my-sandbox',
    component: 'Sandbox',
    source: [
      "import { createElement as h } from 'react';",
      "import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'https://esm.sh/recharts@2?external=react,react-dom';",
      "",
      "export default function SalesChart({ data, color }) {",
      "  return h(ResponsiveContainer, { width: '100%', height: 200 },",
      "    h(BarChart, { data, margin: { top: 8, right: 16, left: 0, bottom: 0 } },",
      "      h(CartesianGrid, { strokeDasharray: '3 3' }),",
      "      h(XAxis, { dataKey: 'month' }),",
      "      h(YAxis, null),",
      "      h(Tooltip, null),",
      "      h(Bar, { dataKey: 'value', fill: color ?? '#6366f1', radius: [4, 4, 0, 0] })",
      "    )",
      "  );",
      "}",
    ].map(line => line.trim()).join('\n'),
    props: {
      data: [
        { month: 'Jan', value: 40 },
        { month: 'Feb', value: 70 },
        { month: 'Mar', value: 55 },
        { month: 'Apr', value: 90 },
      ],
      color: '#6366f1',
    },
  }),
  notes: [
    'source must be a valid ES module that default-exports a React component.',
    'JSX is NOT supported — use createElement (aliased as h) instead.',
    '"react" and "react-dom/client" are pre-mapped in the importmap.',
    'For external libraries, import via https://esm.sh/<pkg>@<version>?external=react,react-dom to share the same React instance.',
    'Use props to pass dynamic data into the component.',
  ].join(' '),
})
