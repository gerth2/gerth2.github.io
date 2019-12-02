@setlocal
:PROMPT
@SET /P AREYOUSURE=Are you sure you want to make your changes live on the internet (Y/[N])?
@IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

call bundle exec jekyll build
git add --all
git commit -m "Committing build in prep for deployment"

git subtree split --prefix _site -b temp
git push -f origin temp:master
git branch -D temp

::git subtree push --prefix _site origin master

@echo Completed public deployment.

pause

:end
@echo deployment script ended.
@endlocal