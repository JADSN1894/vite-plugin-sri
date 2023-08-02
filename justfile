# List possible commands
list:
    @just --list

# Clean
clean:
    @rm -rf dist node_modules package-lock.json 
    @npm cache clean target --force

# Update packages
update-pkgs: clean
    @npm update --save --all

# Generate plugin airtfacts
build: update-pkgs
    npm run build