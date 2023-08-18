import {
  Avatar,
  Box,
  Button,
  styled,
  InputBase,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';
import { sendMessage } from '../../../actions/contactAction';

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`
);

function BottomBarContent() {
  const theme = useTheme();
  const dispatch: any = useDispatch();

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  const [message, setMessage] = useState({
    sender: currentUser._id,
    receiver: 'server',
    content: null
  })

  const onSendClick = e => {
    e.preventDefault();

    dispatch(sendMessage(message))
  }

  const onChange = e => {
    setMessage({
      ...message,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box
      sx={{
        background: theme.colors.alpha.white[50],
        display: 'flex',
        alignItems: 'center',
        p: 2
      }}
    >
      <Box flexGrow={1} display="flex" alignItems="center">
        <Avatar
          sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }}
          alt={currentUser.name}
          src={currentUser.avatar}
        />
        <MessageInputWrapper
          autoFocus
          name='content'
          placeholder="Write your message here..."
          fullWidth
          onChange={onChange}
        />
      </Box>
      <Box>
        <Button startIcon={<SendTwoToneIcon />} variant="contained" onClick={onSendClick}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default BottomBarContent;
