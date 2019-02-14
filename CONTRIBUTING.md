
# Contributing to Anamnesiac

Welcome! This guide will help you get started in contributing to the Anamnesiac app, as well as talk about common pitfalls and ways to troubleshoot your contributions.

## Getting Started

- First, you gotta sign up for GitHub. That's the site you're on right now. 
- Once you've signed up, you can go to any data file (discussed in a bit) and hit the "edit" button.
- After you've finished your edits, you'll have to make sure you submit a pull request. More on that in a bit. 

## The Data Files

Data is stored in the YML format. YML is human-readable but machine-processable. If you follow the format of the data that has been established, your contribution will Just Work™. 

Here are a list of links:

- [The Items](https://github.com/seiyria/anamnesiac/tree/master/src/assets/data/item) - sorted by type. 
- [Item Images](https://github.com/seiyria/anamnesiac/tree/master/src/assets/items) - used by the items to link their appropriate image.
- [The Characters](https://github.com/seiyria/anamnesiac/tree/master/src/assets/data/character) - sorted by class.
- [Character Images](https://github.com/seiyria/anamnesiac/tree/master/src/assets/characters) - used by the characters to link to their appropriate image.

You'll focus on editing the items and characters - updating their notes, adding new ones, etc. The images can also be contributed if there are any missing!

## Editing The Files

Just hit the pencil in the top right of the file you want to edit. After you've finished editing, you need to submit a **Pull Request**. Basically, this means you're going to take your version of the files and merge them with this copy, which will ultimately update the app. To do this, just go [here](https://github.com/seiyria/anamnesiac) and you should see a "Make Pull Request" button. Submit all of that and it will notify the contributors to review it, and hopefully get it in.

### Editing JP/GL Data

JP and GL data are stored in the same files, but they have one primary difference, their `cat` variable. It is set to `jp` for JP data and `gl` for GL data. Pretty simple, but if you're editing something, just make sure you're in the right region!

### Metadata

Some skills, talents, and rushes have a `meta` block associated with them. This is the metadata used by the Party Creator to figure out how abilities should stack. These notes are taken from [the JP spreadsheet](https://docs.google.com/spreadsheets/d/1Pt8C20Zcu4yRCAFIJrKwG9I-agkrhpzi6W-DSKOorDM/edit). If you add new skills, talents, or rushes that boost attributes, please add the meta block too!

### Reviews

Your submissions will be reviewed both automatically and manually. Primarily, manual review is just making sure data is in the right place and that there aren't any spelling errors. The automatic review will make sure you've put in all the data _correctly_. This means that you don't have any weird weapon types, you have the correct data types set for all of the fields you edit, and that, most importantly, it doesn't break the app for other users.

#### Automatic Features

There are some really nifty features that work with the pipeline here. One of them is _deploy previews_. Basically, this means that when you submit your pull request, you can check what your submission would look like, live, in the app, but without requiring an update. You'll see a `netlify/preview` check below your submission, and when it says "Preview ready!" you can click the link to see what your changes are like in the app. Please do this to make sure it is what you expect! 

**When you have finished looking at your changes, please put a comment in the Pull Request to say you've reviewed it!**

### Adding Images

Sometimes, you have to add an image the app doesn't have to make it all work right. This shouldn't be a frequent occurrence, but in the event that it is, please ask for the image or get it from the Dropbox. Additionally, **when you add an image, do not make a separate pull request for it, add it to your existing pull request!** This will help it pass all of the tests to ensure everything is good, and it will require less manual intervention.

#### Where Are The Images?

At this time, images can be found [in our shared Dropbox folder](https://www.dropbox.com/sh/rf0ylyh96el7gw1/AAB26paL63wjzYRLE3-1pVvEa?dl=0). If you add images, _only add them from this source_, and _only from the compilation folders_. Thanks in advance!

#### Troubleshooting Your Submission

Things happen and things break. That's okay! We have these processes in place so we catch the problem before it becomes a bigger one. When you submit your pull request, another check called `travis ci` will be running to make sure all of the data is set up correctly.

Primarily, if you see a big red X next to `travis ci` that means you submitted something and it has a very obvious error. If you click "details" you'll be sent to the Travis CI website and it will tell you (in some slightly more technical terms) what your specific error was. Usually this relates to indentation of the data. If it's not in the right place, it'll break like this.

However, sometimes your data will not break, but still not show up. Most prominently for notes, which are right below the `rush` block (for most submissions), the `notes` block will be indented a few times too far. You want to line it up with the other `Character` fields, which would be `rush`, `traits`, `skills`, etc. If the indentation puts it farther to the right, ie, in the `rush` block, it will not show up as expected. This is a common pitfall, so be careful when you copy and paste!

## Acceptance

After everything works, and your submission has been validated, it will be accepted and it will be live on the app itself within 5-10 minutes (usually). Thanks in advance for your submissions!

If you have any further questions, don't hesitate to add comments or reach out directly - if you're having the problem, someone else is too!
