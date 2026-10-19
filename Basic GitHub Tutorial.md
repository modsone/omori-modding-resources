# Basic Git/GitHub Tutorial
*Note: This is copied over from the Omori Modding Discord forum post by Stahl after it's archival.*

This post serves as a basic tutorial for setting up and managing a git repository for your project, including branching, pull requests, and merging. When working on a team, or even by yourself, it can be useful to utilize Git for version control, conflict prevention, and even backups if something goes wrong on your end.

This guide will work with commands and GitHub Desktop. GitHub has great tutorials (with pictures) for the GitHub Desktop app that I will be referencing throughout this tutorial: <https://docs.github.com/en/desktop>

## Setup

If you are planning on using GitHub Desktop, you can first download GitHub Desktop and log in with your GitHub account. Afterward, skip this step and go to **Creating a Repository**.

If you would like to use commands and have not yet installed Git, you can do so by running the following command in your operating system of choice:
Windows (Powershell): `winget install --id Git.Git -e --source winget`
Linux: `sudo apt install git`/`sudo pacman -S git` / etc. (depending on distro)

If you are planning to work using Git commands, you will need a way to authenticate yourself. It is recommended you use SSH with a passkey to do so. GitHub has their own tutorial for this here: 

Generating a Key: <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=windows>
Adding the key to your account: <https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account>

After you have set up an SSH key on your account, you can freely push and pull from repositories connected to your account via commands.

## Creating a Repository

In GitHub desktop, navigate to `File > New repository`. You can also create an empty repository on the website by navigating to your profile, clicking on the "Repositories" tab, and clicking the green "New" button. You can then fill out the following:
`Repository name`: The name of your repository. It cannot contain spaces or special characters besides `.`, `-`, and `_`
`Description`: A short description of what your repository is.
`Visibility:` Whether you want the repository to be visible to the public.
`Add README:` Autogenerates a `README.md` file. I would recommend turning this **on**.
`Add .gitignore:` Adds a `.gitignore` file. I would also recommend turning this **on**. This is a text file where you can add files and directories to be ignored by git.
`Add license:` The license your repository uses. If you are planning on making your repository public, I would consult this: <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository> otherwise just leave it blank.

Once you are ready, click "Create repository" and your new empty repository will be created!

## Cloning your repository

If you are on GitHub Desktop and created a repository in the above step, your repo should already be cloned. However, if you need to clone someone else's repository or want a fresh copy of yours, you can do the following using the repository's URL, which will look something like `https://github.com/OwnerName/RepositoryName.git`. You can easily get this URL by navigating to the repo's webpage and clicking the green "Code" button.

GitHub Desktop: Navigate to `File > Clone repository > URL`, and paste in the repo's URL into the field. Make sure to select a folder where you want the repo to be cloned to.
Command: `git clone https://github.com/OwnerName/RepositoryName.git .`
The period in this command will clone the repository into whatever folder you have the terminal in. You can right click in the file explorer and click "Open in Terminal" to open your current folder in the terminal, then run the clone.

After cloning, you now have a fresh copy of the repository's `main` branch on your system! We can finally start working on our project.

## Creating a repository from an existing project
If you already have files or a project that you want to turn into a Git repository, you can easily do so. 

GitHub Desktop: Navigate to `File > Add local repository...`. Select your project's folder as the path. If there is already a Git repo present here, GitHub Desktop will recognize it. If not, GitHub Desktop will create a new repository for you. You can then click "Publish repository" at the top to push your new repository to GitHub.
Commands:
This will require you to already have a GitHub repository set up. See the **Creating a repository** step for more info.
```
git init
git add .
git commit -m "Inital commit"
git remote add origin https://github.com/YourName/YourRepositoryName.git
// pull any existing files such as README.md
git pull origin main --allow-unrelated-histories 
git push -u origin main
```

## Creating a branch and pushing

The first step is to create a branch. This is where all of your changes will go. 

GitHub Desktop: Click on "Current Branch" at the top, click "New Branch". Give your branch a meaningful name, and set `Create branch based on...` the `main` branch. You can also select another branch to base your branch off of, but for now just choose `main`.
Commands (in your project's folder):
```
git branch your-branch-name
git switch your-branch-name
git status

(Should print something like)
On branch your-branch-name
Your branch is up to date with 'origin/your-branch-name'.
```

You are now on your own branch. You can freely push changes onto this branch without affecting the origin `main`, and you should push to your branch often. As you make changes, git will automatically keep track of your changes that you can view in the GitHub Desktop GUI or via `git status` at any time. You can also switch to somebody else's branch using the same method if you want to try out or modify their changes.

When you are ready to push code, you must fill out a commit message. 
GitHub Desktop: Check off the files you want to commit in the sidebar. Give your commit a meaningful name (not "Stuff") and click "Commit X files to branch-name" to commit the changes. Note that these changes are not live, and must be pushed in order to be permanent.
Commands:
```
// good to check what you're changing first
git status
// adds all files to the commit
git add .
// can also add files manually
git add file_name

git commit -m "Your detailed changes here"
```

When you are ready to make your changes permanent on your branch, you must "push" your code.
GitHub Desktop: Click the "Push origin" button at the top. If there are changes present on your branch, you will need to "pull" them first, as explained in **Pulling code from a branch**
Commands:
```
// pushing for the first time. this sets the "upstream" origin for your branch
git push -u origin your-branch-name
// afterward, you can just push normally
git push

// You will be prompted for your SSH passphrase here
```
When you are ready to merge your pushed changes into `main`, this is where a Pull Request comes into play.

## Pulling code from a branch

If someone else is working on the same branch as you, you will need to "pull" their changes into yours. You can do this easily in GitHub Desktop by clicking the "Fetch origin" button. If there are changes to pull, the button will change into "Pull origin", which you can use to pull any changes onto your system.

If you are using commands, you can use the following:
```
// fetches changes without actually merging them into your local files
git fetch 
// fetches and merges changes into your local files
git pull
```

## Creating a Pull Request
This part of the tutorial will be done on the website, as it is easiest to explain here.

On your repository's site, click on the `Pull requests` tab, and click the green `New pull request` button. Set the `base` to `main` (or whatever branch you want to merge into) and set the `compare` to your branch name. GitHub will now give you an itemized list of all of your commits and files changed on your branch. You can scroll down to view the "diff" (the additions and removals) of each file you've edited before merging. GitHub will also alert you of any "merge conflicts" that need to be resolved before pushing.

If you are satisfied with the changes, you can proceed with `Create pull request`. Fill out the title and description with a meaningful description of what your Pull Request entails. Finally, you can click `Create pull request` again to create your PR! You can also click the dropdown and select `Draft pull request` if you want to mark your PR as a draft. This is useful if your code isn't quite ready, but you want other people to see it and review it before marking it ready for merging.

Once your pull request is live, it will be listed on your repository site for your team or yourself to review. GitHub will also continuously run conflict checks whenever the `main` or branch you are targeting is updated. If merge conflicts arise, GitHub will prevent you from merging the PR until the conflict is resolved.

If your changes are approved and ready to merge, simply click the `Merge pull request` button, and your branch will be merged into your target. You can now safely click the `Delete branch` button to remove your branch as it is no longer needed. If you need to make more changes, you can simply make another branch and start the process anew.

## Conclusion

This tutorial should (hopefully) give you a basic understanding of the benefits of working with Git and GitHub with a project, either as a team or on your own. I may update this tutorial in the future with additional concepts such as reverting pushes, resolving complex merge conflicts, and more, however this should at least help get your repository off and running for basic use. Thank you for reading! <:HEART_:1029454596688588850>