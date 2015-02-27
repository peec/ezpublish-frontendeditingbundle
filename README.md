# Frontend Editing Bundle for eZ Publish Platform

Full featured frontend editing bundle for eZ Publish Platform (new stack).
The new eZ Publish Platform does not come with a native frontend editing tool, this bundle implements frontend editing
relying heavily on Angular JS, Twitter Bootstrap and Font-awesome for the icons.

Your pagelayout needs to use boostrap and font-awesome in order for the frontend editing to look good. Meaning the design
 needs to be based on those.


## NOTE: UNDER DEVELOPMENT - BUT somewhat usable.



## Idea / Feature list

- Angular JS frontend editing for ezpublish. Meaning single-page edit app on top of your website frontend.
- Drag and drop things on zones based on data attributes in the HTML. Zones are defined with data- attributes.
- Click on the thing you want to edit, edit and publish.
- Possible to add your own FIELD TYPES (extensible) using angular methods.
- Possible to override standard editing of field types.


## TODO LIST

- Add all common datatypes that is standard in ezpublish platform.
- Object relation field type support
- Richtext field type editor (when its time).
- Allow to click on stuff on the page to edit the object that the specific thing refers to.
- Cleanups etc.


## INSTALLATION

#### 1. Add to your composer.json

Add this to composer.json:

```json
"require": {
     "siter/ezpublish-frontendeditingbundle": "@dev"
}
```

and run:

```bash
composer update siter/ezpublish-frontendeditingbundle
```



#### 2. Setup less filter.

This bundle includes less files for the CSS of the frontend editing, you you need to setup less.

First edit config.yml, setup assetic less filter, install nodejs and less compiler.

```yaml
assetic:
    debug:          "%kernel.debug%"
    use_controller: false
    bundles:        [ SiterFrontendEditingBundle ]
    #java: /usr/bin/java
    filters:
        # .....
        less:
            node: /usr/local/bin/node
            node_paths: [/usr/local/lib/node_modules]
            apply_to: "\.less$"
```

#### 3. Configure AppKernel and import routes.

Edit the `ezpublish/EzPublishKernel.php` and add:

```php
$bundles[] = new Siter\FrontendEditingBundle\SiterFrontendEditingBundle();
```

Edit the `ezpublish/config/routing.yml` and add:

```yaml
siter_frontend_editing:
    resource: "@SiterFrontendEditingBundle/Resources/config/routing.yml"
    prefix:   /frontendediting
```

#### 4. Dump assets.

Dump asset for prod and dev. change --env.

```bash
php ezpublish/console assetic:dump --env="prod"
```

## IMPLEMENT

#### 1. Include the nessecary templates in your pagelayout

- Bootstrap is required for your pagelayout.
- Font-awesome is required.

This is the very important step and it needs to be done correctly in order for the frontend editing layout to work.

Right after the `<body>` tag add:

```twig
{% include 'SiterFrontendEditingBundle:editsuite:pagewrapper_start.html.twig' %}
```


Right after your first main page container e.g. `<div id="page">` add:

```twig
{% include 'SiterFrontendEditingBundle:editsuite:toolbar.html.twig' %}
```


Right before `</body>` add:

```twig
{% include 'SiterFrontendEditingBundle:editsuite:pagewrapper_end.html.twig' %}
```


#### 2. Add data attributes to container zones.

Say you list children from a parent node ( e.g. a menu or a listview or blockview of items ). If you want the editor
to be able to forexample place an article and news_article in a zone add, lets see how you can do that:

Add the following to the container of the children:


```twig
<div class="content-view-children"
{% if is_granted( 'IS_AUTHENTICATED_FULLY' ) %}
    data-location="{{ parent.id }}"
    ng-drop="true"
    ng-drop-success="dropNewChildComplete($data,$event)"
    ng-drop-hit-check="dropNewChildHitCheck($data, $event)"
    data-dropablecontent
    data-allowed_contenttypes="['article','news_article']"
{% endif %}
>
Here is your normal logic to list articles and news articles.
</div>
```





## Contribute

I am happy to take pull requests, feature ideas and such.




