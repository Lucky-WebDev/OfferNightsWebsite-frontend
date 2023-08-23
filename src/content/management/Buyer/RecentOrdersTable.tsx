import { FC, ChangeEvent, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  TextField,
  Modal
} from '@mui/material';

import { ItemStatus } from '../../../models/data_filter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../config/marker/buyer-marker.png'),
  iconUrl: require('../../../config/marker/buyer-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

interface RecentOrdersTableProps {
  className?: string;
  tableItems: any;
}

interface Filters {
  status?: ItemStatus;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const applyFilters = (tableItems: any, filters: Filters): any => {
  return tableItems.filter((tableItem) => {
    let matches = true;

    if (filters.status && tableItem.status !== filters.status) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (tableItems: any, page: number, limit: number): any => {
  return tableItems && tableItems.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ tableItems }) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredTableItems = applyFilters(tableItems, filters);
  const paginatedTableData = applyPagination(filteredTableItems, page, limit);

  const theme = useTheme();

  const [mapView, setMapView] = useState(false);
  const onMapViewHandlerClick = () => setMapView(true);
  const onMapViewHandlerClose = () => setMapView(false);

  const mapRef = useRef();

  const [currentPosition, setCurrentPosition] = useState({
    lat: '',
    lng: '',
    radius: 0
  });

  const [mapViewBounds, setMapViewBounds] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  });

  const onMapView = (index) => {
    setCurrentPosition({
      lat: tableItems[index].lat,
      lng: tableItems[index].lng,
      radius: tableItems[index].radius
    });

    setMapViewBounds({
      x1: Number(tableItems[index].lat) - 0.05,
      y1: Number(tableItems[index].lng) - 0.05,
      x2: Number(tableItems[index].lat) + 0.05,
      y2: Number(tableItems[index].lng) + 0.05
    });

    onMapViewHandlerClick();
  };

  return (
    <Card>
      <CardHeader
        action={
          <Box width={250}>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="outlined-basic"
                label="Search"
                name="search"
                variant="outlined"
              />
            </FormControl>
          </Box>
        }
        title="All Buyers"
      />
      <Divider />
      <Modal
        open={mapView}
        onClose={onMapViewHandlerClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MapContainer
            bounds={[
              [mapViewBounds.x1, mapViewBounds.y1],
              [mapViewBounds.x2, mapViewBounds.y2]
            ]}
            style={{ height: '600px', width: '100%' }}
            zoom={9}
            ref={mapRef}
          >
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
            ></Marker>
            <Polygon
              positions={[
                [
                  [
                    Number(currentPosition.lat) -
                      Number(currentPosition.radius) / 200,
                    Number(currentPosition.lng) +
                      Number(currentPosition.radius) / 200
                  ],
                  [
                    Number(currentPosition.lat) -
                      Number(currentPosition.radius) / 200,
                    Number(currentPosition.lng) -
                      Number(currentPosition.radius) / 200
                  ],
                  [
                    Number(currentPosition.lat) +
                      Number(currentPosition.radius) / 200,
                    Number(currentPosition.lng) -
                      Number(currentPosition.radius) / 200
                  ],
                  [
                    Number(currentPosition.lat) +
                      Number(currentPosition.radius) / 200,
                    Number(currentPosition.lng) +
                      Number(currentPosition.radius) / 200
                  ],
                  [
                    Number(currentPosition.lat) -
                      Number(currentPosition.radius) / 200,
                    Number(currentPosition.lng) +
                      Number(currentPosition.radius) / 200
                  ]
                ]
              ]}
            />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </Box>
      </Modal>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Street Address</TableCell>
              <TableCell align="right">Realtor?</TableCell>
              <TableCell align="right">With a realtor?</TableCell>
              <TableCell align="right">Approved mortage?</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTableData &&
              paginatedTableData.map((tableItem, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tableItem.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tableItem.city ?? ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        <Link to={''} onClick={() => onMapView(index)}>
                          {tableItem.houseNumber ?? ''}{' '}
                          {tableItem.highway ?? ''} {tableItem.suburb ?? ''}{' '}
                          {tableItem.road ?? ''} {tableItem.village ?? ''}{' '}
                          {tableItem.quarter ?? ''} {tableItem.region ?? ''}{' '}
                          {tableItem.county ?? ''}
                        </Link>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tableItem.youRealtor}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tableItem.withRealtor}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {tableItem.mortage}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip
                        title={
                          '1. Type of house : ' +
                          tableItem.typeHouse +
                          ',\n' +
                          '2. Interest City : ' +
                          tableItem.interestCity +
                          ',\n' +
                          '3. Communication : ' +
                          tableItem.phone
                        }
                        arrow
                      >
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Contact" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <ConnectWithoutContactIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredTableItems.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  tableItems: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  tableItems: []
};

export default RecentOrdersTable;
