import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
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
} from '@mui/material';

import { CryptoOrder, CryptoOrderStatus } from '../../../../../models/crypto_order';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../../../reducer/dataType';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { deleteBuyerInfo } from '../../../../../actions/buyerAction';

interface Filters {
  status?: CryptoOrderStatus;
}

const applyPagination = (
  cryptoOrders: any,
  page: number,
  limit: number
): any[] => {
  return cryptoOrders && cryptoOrders.slice(page * limit, page * limit + limit);
};

function BuyerLocationTable() {
  const dispatch: any = useDispatch();
  const myBuyerInfo: any = useSelector((state: StateType) => state.auth.myBuyerInfo);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const currentUser: any = useSelector((state: StateType) => state.auth.user)

  const [open, setOpen] = useState(false);

  const onDeleteButton = (id) => {
    const data = {
      userId: currentUser._id,
      id: id
    }
    // e.preventDefault();
    dispatch(deleteBuyerInfo(data))
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedCryptoOrders = applyPagination(
    myBuyerInfo,
    page,
    limit
  );

  const theme = useTheme();

  return (
    // <Card>
      // <Divider />
      <div style={{width: '100%'}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Realtor?</TableCell>
              <TableCell>With a realtor?</TableCell>
              <TableCell align="right">Type of house</TableCell>
              <TableCell align="right">Interest City</TableCell>
              <TableCell align="right">Approved mortage?</TableCell>
              <TableCell align="right">Communication</TableCell>
              <TableCell align="right">Delete</TableCell>
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
                      {limit*page+index+1}
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
                      {cryptoOrder.county ?? ''} {cryptoOrder.region ?? ''} {cryptoOrder.quarter ?? ''} {cryptoOrder.village ?? ''} {cryptoOrder.road ?? ''}{cryptoOrder.houseNumber ?? ''}
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
                      {cryptoOrder.youRealtor}
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
                      {cryptoOrder.withRealtor}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.typeHouse}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.interestCity}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.mortage}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {/* <Tooltip title="View on Map" arrow>
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
                    </Tooltip> */}
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
                        onClick={() => onDeleteButton(cryptoOrder._id)}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <SnackbarProvider
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
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
          count={myBuyerInfo ? myBuyerInfo.length : 0}
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
};

export default BuyerLocationTable;
