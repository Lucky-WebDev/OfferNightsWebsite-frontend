import { FC, ChangeEvent, useState } from 'react';
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

import { CryptoOrderStatus } from '../../../../../models/crypto_order';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../../../reducer/dataType';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { deleteSellerInfo } from '../../../../../actions/sellerAction';

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

function SellerLocationTable() {
  const dispatch: any = useDispatch();
  const mySellerInfo: any = useSelector((state: StateType) => state.auth.mySellerInfo);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const currentUser: any = useSelector((state: StateType) => state.auth.user)

  const [open, setOpen] = useState(false);

  const onDeleteButton = (id) => {
    const data = {
      userId: currentUser._id,
      id: id
    }
    dispatch(deleteSellerInfo(data))
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
    mySellerInfo,
    page,
    limit
  );

  const theme = useTheme();

  return (
      <div style={{width: '100%'}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Street Address</TableCell>
              <TableCell>Realtor?</TableCell>
              <TableCell>With a realtor?</TableCell>
              <TableCell align="right">What thinking off?</TableCell>
              <TableCell align="right">Type of Property</TableCell>
              <TableCell align="right">Can realtor contact?</TableCell>
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
                      {cryptoOrder.city ?? ''} 
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
                      {cryptoOrder.houseNumber ?? ''} {cryptoOrder.highway ?? ''} {cryptoOrder.suburb ?? ''} {cryptoOrder.road ?? ''} {cryptoOrder.village ?? ''} {cryptoOrder.quarter ?? ''} {cryptoOrder.region ?? ''} {cryptoOrder.county ?? ''}
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
                      {cryptoOrder.thinking}
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
                      {cryptoOrder.typeProperty}
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
                      {cryptoOrder.realtorContact}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
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
          count={mySellerInfo ? mySellerInfo.length : 0}
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

export default SellerLocationTable;
