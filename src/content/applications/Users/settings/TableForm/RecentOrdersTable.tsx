import { FC, ChangeEvent, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  Button
} from '@mui/material';

import Label from '../../../../../components/Label';
import { CryptoOrder, CryptoOrderStatus } from '../../../../../models/location';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { cryptoOrders } from '../LocationData'
import { StateType } from '../../../../../reducer/dataType';
import { useDispatch, useSelector } from 'react-redux';
import { deleteActiveArea } from '../../../../../actions/mapAction';

const applyPagination = (
  cryptoOrders: CryptoOrder[],
  page: number,
  limit: number
): CryptoOrder[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

function RecentOrdersTable() {
  const dispatch: any = useDispatch();

  const theme = useTheme();

  const activeArea: any = useSelector((state: StateType) => state.auth.activeArea)

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  const onDeleteButton = (id) => {
    const data = {
      userId: currentUser._id,
      id: id
    }
    // e.preventDefault();
    dispatch(deleteActiveArea(data))
  }

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeArea && activeArea.map((area, index) => {
              return (
                <TableRow
                  hover
                  key={index+1}
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
                      {area.country}
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
                      {area.state ?? ''} {area.city ?? ''} 
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
                      {area.county ?? ''} {area.region ?? ''} {area.quarter ?? ''} {area.village ?? ''} {area.road ?? ''}{area.houseNumber ?? ''}
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
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: []
};

export default RecentOrdersTable;
