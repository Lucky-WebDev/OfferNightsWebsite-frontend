import { useState, SyntheticEvent } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  styled,
} from '@mui/material';
import { formatDistance, subMinutes } from 'date-fns';
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import VideoCameraFrontTwoToneIcon from '@mui/icons-material/VideoCameraFrontTwoTone';

const RootWrapper = styled(Box)(
  ({ theme }) => `
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
`
);

function TopBarContent() {

  return (
    <>
      <RootWrapper>
        <Box display="flex" alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48
            }}
            alt="Server manager"
            src="/static/images/avatars/server.jpg"
          />
          <Box ml={1}>
            <Typography variant="h4">Server Manager</Typography>
            <Typography variant="subtitle1">
              {formatDistance(subMinutes(new Date(), 8), new Date(), {
                addSuffix: true
              })}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' }
          }}
        >
          <Tooltip placement="bottom" title="Start a voice call">
            <IconButton color="primary">
              <CallTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip placement="bottom" title="Start a video call">
            <IconButton color="primary">
              <VideoCameraFrontTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </RootWrapper>
    </>
  );
}

export default TopBarContent;
