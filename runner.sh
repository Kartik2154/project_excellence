#!/bin/bash

# Start a new tmux session named "dev"
tmux new-session -d -s dev

# Run backend in the first pane
tmux send-keys -t dev 'cd backend && npm start' C-m

# Split window vertically and run frontend
tmux split-window -h -t dev
tmux send-keys -t dev 'cd frontend && npm run dev' C-m

# Attach to the session
tmux attach -t dev
