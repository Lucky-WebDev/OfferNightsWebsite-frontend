import { FC, ChangeEvent, useState, useRef } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  TextField,
  Modal
} from '@mui/material';

import { CryptoOrderStatus } from '../../../models/crypto_order';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';
import BulkActions from './BulkActions';
import { ContactMailOutlined } from '@mui/icons-material';
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../config/marker/farming-marker.png'),
  iconUrl: require('../../../config/marker/farming-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: any;
}

interface Filters {
  status?: CryptoOrderStatus;
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

const applyFilters = (
  cryptoOrders: any,
  filters: Filters
): any => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: any,
  page: number,
  limit: number
): any => {
  return cryptoOrders && cryptoOrders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ cryptoOrders }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
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

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );

  const mapBounds: any = [
    [69.5335129, -153.8220681],
    [43.31166455, -56.44995099337655]
  ];

  const [mapView, setMapView] = useState(false);
  const onMapViewHandlerClick = () => setMapView(true)
  const onMapViewHandlerClose = () => setMapView(false)

  const mapRef = useRef();

  const theme = useTheme();

  const [currentPosition, setCurrentPosition] = useState({
    lat: '',
    lng: '',
    radius: ''
  });

  const [mapViewBounds, setMapViewBounds] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  });

  const onMapView = index => {
    setCurrentPosition({
      lat: cryptoOrders[index].lat,
      lng: cryptoOrders[index].lng,
      radius: cryptoOrders[index].radius
    })

    setMapViewBounds({
      x1: Number(cryptoOrders[index].lat)-0.05,
      y1: Number(cryptoOrders[index].lng)-0.05,
      x2: Number(cryptoOrders[index].lat)+0.05,
      y2: Number(cryptoOrders[index].lng)+0.05,
    })

    onMapViewHandlerClick()
  }

  return (
    <Card>
        <CardHeader
        action={
          <Box width={250}>
            <FormControl fullWidth variant="outlined">
              <TextField id="outlined-basic" label="Search" name="search" variant="outlined" />
            </FormControl>
          </Box>
        }
        title="All Active Agents"
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
            bounds={[[mapViewBounds.x1, mapViewBounds.y1], [mapViewBounds.x2, mapViewBounds.y2]]}
            style={{ height: '600px', width: '100%' }}
            zoom={9}
            ref={mapRef}
          >
            <Marker position={[currentPosition.lat, currentPosition.lng]}>
            </Marker>
            <Polygon positions={[[
              [Number(currentPosition.lat)-Number(currentPosition.radius)/200, Number(currentPosition.lng)+Number(currentPosition.radius)/200],
              [Number(currentPosition.lat)-Number(currentPosition.radius)/200, Number(currentPosition.lng)-Number(currentPosition.radius)/200],
              [Number(currentPosition.lat)+Number(currentPosition.radius)/200, Number(currentPosition.lng)-Number(currentPosition.radius)/200],
              [Number(currentPosition.lat)+Number(currentPosition.radius)/200, Number(currentPosition.lng)+Number(currentPosition.radius)/200],
              [Number(currentPosition.lat)-Number(currentPosition.radius)/200, Number(currentPosition.lng)+Number(currentPosition.radius)/200],
            ]]} />
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
              <TableCell>Place</TableCell>
              <TableCell align="right">Postal Code</TableCell>
              {/* <TableCell align="right">Radius</TableCell> */}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders && paginatedCryptoOrders.map((cryptoOrder, index) => {
              return (
                <TableRow
                  hover
                  key={index}
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {index+1}
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
                      {cryptoOrder.name}
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
                      {cryptoOrder.state ?? ''} {cryptoOrder.city ?? ''} 
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
                        {cryptoOrder.county ?? ''} {cryptoOrder.region ?? ''} {cryptoOrder.quarter ?? ''} {cryptoOrder.village ?? ''} {cryptoOrder.road ?? ''}{cryptoOrder.houseNumber ?? ''}  {cryptoOrder.highway ?? ''} {cryptoOrder.suburb ?? ''}
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
                      {cryptoOrder.code}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.radius} Km
                    </Typography>
                  </TableCell> */}
                  <TableCell align="right">
                    <Tooltip title={
                      "Created Date : " + cryptoOrder.createdDate 
                    } arrow>
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
          count={filteredCryptoOrders.length}
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
  cryptoOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: []
};

export default RecentOrdersTable;
