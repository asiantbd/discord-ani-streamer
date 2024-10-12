#!/bin/sh

# Path to the ani-cli script
ANI_CLI_PATH="./ani-cli"

## Set ANI_CLI_NON_INTERACTIVE
sed -i '2a\ANI_CLI_NON_INTERACTIVE=1' "$ANI_CLI_PATH"

## Append additional flag to enable custom patch mode
## The flag will receive 1 argument (allanimeday_id)
sed -i.bak '
/^        -U | --update) update_script ;;$/ {
    a\
        --patch-discord-ani-stream) \
            [ $# -lt 2 ] && die "missing argument!"\
            player_function=debug\
            discord_allanimeday_id=$2\
            shift\
            ;;\

}
' "$ANI_CLI_PATH"

## Patch $anime_list data, bypass search_anime results using dummy value
sed -i.bak 's/anime_list=$(search_anime "$query")/anime_list="xxxxx bypassed"/' "$ANI_CLI_PATH"

## Patch $id, replace the value using $discord_allanimeday_id from discord patch arguments
sed -i.bak 's/id=$(printf "%s" "$result" | cut -f1)/id=${discord_allanimeday_id:-$(printf "%s" "$result" | cut -f1)}/' "$ANI_CLI_PATH"

echo "Patched ani-cli script with --get-stream-url flag"

# Remove the backup file created by sed
# rm "${ANI_CLI_PATH}.bak"
