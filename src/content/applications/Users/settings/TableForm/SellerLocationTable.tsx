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
  useTheme
} from '@mui/material';

import { ItemStatus } from '../../../../../models/data_filter';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../../../reducer/dataType';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { deleteSellerInfo } from '../../../../../actions/sellerAction';

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

function SellerLocationTable() {
  const dispatch: any = useDispatch();
  const mySellerInfo: any = useSelector(
    (state: StateType) => state.auth.mySellerInfo
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
    dispatch(deleteSellerInfo(data));
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

  const paginatedTableData = applyPagination(mySellerInfo, page, limit);

  const theme = useTheme();

  return (
    <div style={{ width: '100%' }}>
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
                        {tableItem.youRealtor}
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
                        {tableItem.thinking}
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
                        {tableItem.typeProperty}
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
                        {tableItem.realtorContact}
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
}

export default SellerLocationTable;
