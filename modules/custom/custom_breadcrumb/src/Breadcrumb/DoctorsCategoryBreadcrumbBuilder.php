<?php

namespace Drupal\custom_breadcrumb\Breadcrumb;

use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Link;

class DoctorsCategoryBreadcrumbBuilder implements BreadcrumbBuilderInterface {
  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $attributes) {
    $parameters = $attributes->getParameters()->all();



    if (isset($parameters['taxonomy_term'])) {
      /**
       * @var \Drupal\taxonomy\Entity\Term $term
       */
      $term = $parameters['taxonomy_term'];

      if ($term->bundle() == "doctors") {
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
     * @var \Drupal\taxonomy\Entity\Term $term
     */
    $term = $parameters['taxonomy_term'];

    /**
     * @var \Drupal\taxonomy\TermStorage $storage
     */
    $storage = \Drupal::entityTypeManager()->getStorage("taxonomy_term");
    $parents = $storage->loadAllParents($term->id());

    $breadcrumb = new Breadcrumb();
    $breadcrumb->addLink(Link::createFromRoute('Главная', '<front>'));
    $breadcrumb->addLink(Link::createFromRoute('Врачи', 'page_manager.page_view_doctors_doctors-panels_variant-0'));

    /**
     * @var \Drupal\taxonomy\Entity\Term $t
     */
    foreach (array_reverse($parents) as $t) {
      if($term->id() != $t->id()) {
        $breadcrumb->addLink(Link::createFromRoute($t->getName(), "entity.taxonomy_term.canonical", ['taxonomy_term' => $t->id()]));
      }
    }

    $breadcrumb->addLink(Link::createFromRoute($term->getName(), '<none>'));
    $breadcrumb->addCacheContexts(['url.path']);

    return $breadcrumb;
  }

}
