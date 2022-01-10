<?php

namespace Drupal\custom_breadcrumb\Breadcrumb;

use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Link;

class BolezniBreadcrumbBuilder implements BreadcrumbBuilderInterface {
  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $attributes) {

    $parameters = $attributes->getParameters()->all();
   
   
    
    if (isset($parameters['base_route_name'])) {
      if ($parameters['base_route_name'] == "page_manager.page_view_bolezni") {
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match) {
    $breadcrumb = new Breadcrumb();
    $breadcrumb->addLink(Link::createFromRoute('Главная', '<front>'));
    $breadcrumb->addLink(Link::createFromRoute('Болезни', '<none>'));
    $breadcrumb->addCacheContexts(['url.path']);

    return $breadcrumb;
  }

}