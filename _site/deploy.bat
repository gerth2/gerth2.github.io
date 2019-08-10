call bundle exec jekyll build
git add --all
git commit -m "Committing build in prep for deployment"

git subtree push --force --prefix _site origin master

pause