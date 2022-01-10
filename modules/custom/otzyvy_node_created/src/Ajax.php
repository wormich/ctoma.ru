<?php

namespace Drupal\otzyvy_node_created;

use Drupal\Component\Utility\Html;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\node\Entity\Node;

use Drupal\Core\Form\FormStateInterface;

/**
 * Configure example settings for this site.
 */
class Ajax {

  /**
   * @return array
   */
  public function up(array &$form, FormStateInterface $form_state) {
    $ajax_response = new AjaxResponse();

    /**
     * @var \Drupal\taxonomy\TermStorage $storage
     * @var \Drupal\taxonomy\Entity\Term $term
     * @var \Drupal\node\Entity\Node $node
     */
    $select_clinic = $form['elements']['clinic']['#value'];

    $query = \Drupal::database()->select('node__field_mesta_raboty', 'us');
    $query->addField('us', 'entity_id');
    if ($select_clinic) {
      $query->condition('us.field_mesta_raboty_target_id', $select_clinic);
    }
    $result = $query->execute()->fetchCol();
    $nodes = Node::loadMultiple($result);

    foreach ($form['elements']['doctor']['#options'] as $nid => $node) {
      if ($nid) {
        unset($form['elements']['doctor']['#options'][$nid]);
      }
    }

    foreach ($nodes as $nid => $node) {
      $form['elements']['doctor']['#options'][$nid] = $node->getTitle();
    }

    $ajax_response->addCommand(new ReplaceCommand('.form-item-doctor', $form['elements']['doctor']));
    return $ajax_response;
  }

}