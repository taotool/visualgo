import TimelineIcon from '@mui/icons-material/Timeline';
import LinkIcon from '@mui/icons-material/Link';
import GridOnIcon from '@mui/icons-material/GridOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
export const AlgorithmsNav2 =
[
  {
    segment: 'algorithms',
    title: 'Algorithms',
    icon: <AccountTreeIcon />,
    route: true,
  },
];
export const AlgorithmsNav =
[
  {
    segment: 'algorithms',
    title: 'Algorithms',
    icon: <AccountTreeIcon />,
    route: true,
    children: [
      {
        segment: 'lists',
        title: 'Lists',
        icon: <LinkIcon />,
        route: true
      },
      {
        segment: 'grids',
        title: 'Grids',
        icon: <GridOnIcon />,
        route: true
      },
      {
        segment: 'sorting',
        title: 'Sorting',
        icon: <BarChartIcon />,
        route: true
      },
      {
        segment: 'trees',
        title: 'Trees',
        icon: <AccountTreeIcon />,
        route: true
      },
      {
        segment: 'graphs',
        title: 'Graphs',
        icon: <TimelineIcon />,
        route: true
      },
      {
        segment: 'dp',
        title: 'Dynamic Programming',
        icon: <TimelineIcon />,
        route: true
      }
    ],
  },
];