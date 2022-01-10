<?php

namespace Drupal\custom_breadcrumb\Breadcrumb;

use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Link;

class SharePageBreadcrumbBuilder implements BreadcrumbBuilderInterface {
  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $attributes) {
    $parameters = $attributes->getParameters()->all();
    if (isset($parameters['node'])) {
      /**
       * @var \Drupal\node\Entity\Node $node
       */
      $node = $parameters['node'];

      if (is_a($node,'Drupal\node\Entity\Node') and $node->getType() == 'action') {
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match) {
    $parameters = $route_match->getParameters()->all();
    /**
     * @var \Drupal\node\Entity\Node $node
     */
    $node = $parameters['node'];

    $breadcrumb = new Breadcrumb();
    $breadcrumb->addLink(Link::createFromRoute('Главная', '<front>'));
    $breadcrumb->addLink(Link::createFromRoute('Cпециальные предложения', 'page_manager.page_view_actions_actions-panels_variant-0'));
    $breadcrumb->addLink(Link::createFromRoute($node->getTitle(), '<none>'));
    $breadcrumb->addCacheContexts(['url.path']);
    return $breadcrumb;
  }
}