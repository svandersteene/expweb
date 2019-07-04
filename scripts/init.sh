#! /usr/bin/env bash

# Set development if nothing else
export NODE_ENV=${NODE_ENV:-development}

if [ "$NODE_ENV" = "development" ] && [ -f ".env.development" ]; then
    echo "Notification:\tLocal environment found. Sourcing..."
    source .env.development
fi

# Activate nvm
if [ -n "$(command -v nvm)" ]; then
    nvm use
fi

# Add yarn commands to path
export PATH=$(pwd)/bin:$(yarn bin):$PATH

# Message watchman
if [ "$NODE_ENV" = "development" ] && ! [ -x "$(command -v watchman-make)" ]; then
    echo "\nWarning!:\tWatchman should be installed for development.\n"
    echo "\t\tMore info:"
    echo "\t\thttps://facebook.github.io/watchman/docs/install.html\n"
fi
