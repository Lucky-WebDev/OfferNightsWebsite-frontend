import { useState, MouseEvent, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  Avatar,
  useTheme,
  styled,
  TextField,
} from '@mui/material';

import isEmpty from '../../../../validation/is-empty';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { changePassword } from '../../../../actions/authAction';
import { useSelector } from 'react-redux';
import { StateType } from '../../../../reducer/dataType';

function SecurityTab() {
  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  const [newPassword, setNewPassword] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  })

  const onChange = e => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value
    })
  }

  const onPasswordChangeClick = e => {
    e.preventDefault();

    if (isEmpty(newPassword.currentPassword)) {
      enqueueSnackbar('Please fill the current password.')
      return;
    }
    if (isEmpty(newPassword.password)) {
      enqueueSnackbar('Please fill the new password.')
      return;
    }
    if (isEmpty(newPassword.confirmPassword)) {
      enqueueSnackbar('Please fill the confirm password.')
      return;
    }
    if (newPassword.password !== newPassword.confirmPassword) {
      enqueueSnackbar('Please match new password and confirm password.')
      return;
    }
    
    const data = {
      id: currentUser._id,
      currentPassword: newPassword.currentPassword,
      newPassword: newPassword.password
    }
    changePassword(data);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">Security</Typography>
          <Typography variant="subtitle2">
            Change your security preferences below
          </Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="Change Password"
                secondary="You can change your password here"
              />
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              ></SnackbarProvider>
              <Button size="large" variant="outlined" onClick={onPasswordChangeClick}>
                Change password
              </Button>
            </ListItem>
            <Divider component="li" />
              <Grid container pt={3} pb={2} spacing={1}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Current Password:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="currentPassword" type='password' value={newPassword.currentPassword} variant="outlined" onChange={onChange} />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    New Password:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="password" type='password' value={newPassword.password} variant="outlined" onChange={onChange} />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Confirm Password:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="confirmPassword" type='password' value={newPassword.confirmPassword} variant="outlined" onChange={onChange} />
                </Grid>
              </Grid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SecurityTab;
