import { useRef, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { StateType, UserType } from '../../../../reducer/dataType';
import { signOut } from '../../../../actions/authAction';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {

  const dispatch: any = useDispatch();
  const navigate: any = useNavigate()
  
  const isAuthenticated: boolean = useSelector((state: StateType) => state.auth.isAuthenticated);
  const currentUser: UserType = useSelector((state: StateType) => state.auth.user);
  
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/main.jpg',
    jobtitle: 'Project Manager'
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const onSignOutClick = e => {
    dispatch(signOut())
    navigate('/user/sign-in')
  }

  return (
    <>
      {isAuthenticated == false ? (
        <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
          <Avatar variant="rounded" alt={user.name} />
          <Hidden mdDown>
            <UserBoxText>
              <UserBoxLabel variant="body1">Account</UserBoxLabel>
              <UserBoxDescription variant="body2">
                
              </UserBoxDescription>
            </UserBoxText>
          </Hidden>
          <Hidden smDown>
            <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
          </Hidden>
        </UserBoxButton>
      ) : (
        <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
          <Avatar variant="rounded" alt={'smile'} src={currentUser.avatar} />
          <Hidden mdDown>
            <UserBoxText>
              <UserBoxLabel variant="body1">{currentUser.firstName + " " + currentUser.lastName}</UserBoxLabel>
              <UserBoxDescription variant="body2">
                {currentUser.email}
              </UserBoxDescription>
            </UserBoxText>
          </Hidden>
          <Hidden smDown>
            <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
          </Hidden>
      </UserBoxButton>
      )}
      
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {isAuthenticated == false ? (
          <MenuUserBox sx={{ minWidth: 210 }} display="flex">
            <Avatar variant="rounded" alt={user.name} />
            <UserBoxText>
              <UserBoxLabel variant="body1">Account</UserBoxLabel>
              <UserBoxDescription variant="body2">
                
              </UserBoxDescription>
            </UserBoxText>
          </MenuUserBox>
        ) : (
          <MenuUserBox sx={{ minWidth: 210 }} display="flex">
            <Avatar variant="rounded" alt={'smile'} src={currentUser.avatar} />
            <UserBoxText>
              <UserBoxLabel variant="body1">{currentUser.firstName + " " + currentUser.lastName}</UserBoxLabel>
              <UserBoxDescription variant="body2">
                {currentUser.email}
              </UserBoxDescription>
            </UserBoxText>
          </MenuUserBox>
        )}
        <Divider sx={{ mb: 0 }} />
        {isAuthenticated == false ? (
          <List sx={{ p: 1 }} component="nav">
            <ListItem button to="/user/sign-in" component={NavLink}>
              <LoginOutlinedIcon fontSize="small" />
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem button to="/user/sign-up" component={NavLink}>
              <PersonAddOutlinedIcon fontSize="small" />
              <ListItemText primary="Sign Up" />
            </ListItem>
          </List>
        ): (
          <List sx={{ p: 1 }} component="nav">
            <ListItem button to="/profile/details" component={NavLink}>
              <AccountBoxOutlinedIcon fontSize="small" />
              <ListItemText primary="User" />
            </ListItem>
            <ListItem button to="/profile/settings" component={NavLink}>
              <SettingsOutlinedIcon fontSize="small" />
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        )}
        
        <Divider />
        <Box sx={{ m: 1 }}>
          {isAuthenticated == true ? (
            <Button color="primary" fullWidth onClick={onSignOutClick}>
              <LockOpenTwoToneIcon sx={{ mr: 1 }} />
              Sign out
            </Button>
          ) : ''}
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
