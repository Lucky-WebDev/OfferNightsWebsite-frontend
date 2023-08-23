import { FC, ChangeEvent, useState, useRef } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  Modal
} from '@mui/material';

import { DataFilter, ItemStatus } from '../../../../../models/location';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { StateType } from '../../../../../reducer/dataType';
import { useDispatch, useSelector } from 'react-redux';
import { deleteActiveArea } from '../../../../../actions/mapAction';
import { MapContainer, Marker, Polygon, TileLayer } from 'react-leaflet';

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

function RecentOrdersTable() {
  const dispatch: any = useDispatch();

  const theme = useTheme();

  const activeArea: any = useSelector(
    (state: StateType) => state.auth.activeArea
  );

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  const onDeleteButton = (id) => {
    const data = {
      userId: currentUser._id,
      id: id
    };
    // e.preventDefault();
    dispatch(deleteActiveArea(data));
  };

  const mapRef = useRef();

  const [mapView, setMapView] = useState(false);
  const onMapViewHandlerClick = () => setMapView(true);
  const onMapViewHandlerClose = () => setMapView(false);

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
      lat: activeArea[index].lat,
      lng: activeArea[index].lng,
      radius: Number(activeArea[index].radius)
    });

    setMapViewBounds({
      x1: Number(activeArea[index].lat) - 0.05,
      y1: Number(activeArea[index].lng) - 0.05,
      x2: Number(activeArea[index].lat) + 0.05,
      y2: Number(activeArea[index].lng) + 0.05
    });

    onMapViewHandlerClick();
  };

  return (
    <Card>
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
              <TableCell>City</TableCell>
              <TableCell>Street Address</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell>Radius</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeArea &&
              activeArea.map((area, index) => {
                return (
                  <TableRow hover key={index + 1}>
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
                        {area.city ?? ''}
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
                        {area.houseNumber ?? ''} {area.highway ?? ''}{' '}
                        {area.suburb ?? ''} {area.road ?? ''}{' '}
                        {area.village ?? ''} {area.quarter ?? ''}{' '}
                        {area.region ?? ''} {area.county ?? ''}
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
                        {area.code}
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
                        {area.radius} Km
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Location" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => onMapView(index)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Location" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.warning.lighter
                            },
                            color: theme.palette.warning.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => onDeleteButton(area._id)}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

RecentOrdersTable.propTypes = {
  tableItems: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  tableItems: []
};

export default RecentOrdersTable;
