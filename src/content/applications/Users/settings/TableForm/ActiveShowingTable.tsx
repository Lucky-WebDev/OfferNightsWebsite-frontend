import { FC, ChangeEvent, useState, useRef } from 'react';
import {
  Tooltip,
  Box,
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
  Modal
} from '@mui/material';

import { DataFilter, ItemStatus } from '../../../../../models/data_filter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../../../reducer/dataType';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { deleteActiveShowing } from '../../../../../actions/showingAction';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

interface Filters {
  status?: ItemStatus;
}

const applyPagination = (
  tableItems: any,
  page: number,
  limit: number
): any[] => {
  return tableItems && tableItems.slice(page * limit, page * limit + limit);
};

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

function ActiveShowingTable() {
  const dispatch: any = useDispatch();
  const myActiveShowing: any = useSelector(
    (state: StateType) => state.auth.myActiveShowing
  );

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  const [open, setOpen] = useState(false);

  const onDeleteButton = (id) => {
    const data = {
      userId: currentUser._id,
      id: id
    };
    // e.preventDefault();
    dispatch(deleteActiveShowing(data));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedTableData = applyPagination(myActiveShowing, page, limit);

  const theme = useTheme();

  const mapRef = useRef();

  const [mapView, setMapView] = useState(false);
  const onMapViewHandlerClick = () => setMapView(true);
  const onMapViewHandlerClose = () => setMapView(false);

  const [currentPosition, setCurrentPosition] = useState({
    lat: '',
    lng: ''
  });

  const [mapViewBounds, setMapViewBounds] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  });

  const onMapView = (index) => {
    setCurrentPosition({
      lat: myActiveShowing[index].lat,
      lng: myActiveShowing[index].lng
    });

    setMapViewBounds({
      x1: Number(myActiveShowing[index].lat) - 0.05,
      y1: Number(myActiveShowing[index].lng) - 0.05,
      x2: Number(myActiveShowing[index].lat) + 0.05,
      y2: Number(myActiveShowing[index].lng) + 0.05
    });

    onMapViewHandlerClick();
  };

  return (
    <div style={{ width: '100%' }}>
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
              <TableCell align="right">Unit#</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Offer Date</TableCell>
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
                        {limit * page + index + 1}
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
                        {tableItem.houseNumber ?? ''} {tableItem.highway ?? ''}{' '}
                        {tableItem.suburb ?? ''} {tableItem.road ?? ''}{' '}
                        {tableItem.village ?? ''} {tableItem.quarter ?? ''}{' '}
                        {tableItem.region ?? ''} {tableItem.county ?? ''}
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
                        {tableItem.code}
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
                        {tableItem.unit}
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
                        {tableItem.price}
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
                        {tableItem.offerDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View on Map" arrow>
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
                      <Tooltip title="Delete active showing" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={() => onDeleteButton(tableItem._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <SnackbarProvider
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                      }}
                    ></SnackbarProvider>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={myActiveShowing ? myActiveShowing.length : 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </div>
    // </Card>
  );
}

export default ActiveShowingTable;
