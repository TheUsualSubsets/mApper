# GIT Workflow for Teams

## In case we need refreshers...



###SETTING UP

Make sure you have FORKED the main repo and are working from YOUR FORK.

`git clone LinkToOrgRepo`
`git checkout master`



###MAKING CHANGES

`git pull origin` *(pulls your fork)*
`git checkout master` *(puts you on your local master branch)*
`git pull --rebase upstream master` *(makes sure your local branch is up to date with master branch on source of truth - pulls from master (source of truth) to local master)*

Leave your local master ALONE - should match up-to-date upstream master. Create a new branch with name specific to changes you will make:

`git checkout -b branchname`

####	*Commit often
      *- Every 5-10 lines
       - Every 15 minutes
       -If you're bored...*



###MERGING

There will most likely have been new changes pushed to the upstream master (source of truth) while you were working.
Workflow will NOT be to merge out feature branch back to our local master, but we could do that.

We need to merge the upstream master commits with ours in a way that preserves the history (order the commits were made.) We can rebase the upstream master into the feature branch, which will pull new changes in and put them in the right place.

`git pull --rebase upstream master`
`git push origin branchname` *(pushes your commits to your fork)*
`
submit pull request

#### *someone MUST review the code*



###IF EDITS ARE NEEDED

go back to local computer and checkout branch you were working on
make commits
`git push origin branchname` *(adds commits to already submitted pull request)*

###IF CHANGES ARE ACCEPTED

scrummaster merges and deletes branch

After your changes are accepted, on local machine:
`git branch -d branchname` *(get rid of branch)*
