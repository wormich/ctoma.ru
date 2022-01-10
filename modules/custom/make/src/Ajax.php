<?php

namespace Drupal\make;

use Drupal\Component\Utility\Html;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\ReplaceCommand;

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
     */
    $select_clinic = $form['elements']['clinic']['#value'];
    $storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');

    $query = \Drupal::database()
      ->select('taxonomy_term__field_usluga_dostupna_v_klinikah', 'us');
    $query->addField('us', 'entity_id');
    if ($select_clinic) {
      $query->condition('us.field_usluga_dostupna_v_klinikah_target_id', $select_clinic);
    }
    $result = $query->execute()->fetchCol();

    $terms = $storage->loadMultiple($result);

    foreach ($form['elements']['service']['#options'] as $tid => $term) {
      if ($tid) {
        unset($form['elements']['service']['#options'][$tid]);
      }
    }

    foreach ($terms as $tid => $term) {
      $form['elements']['service']['#options'][$tid] = $term->getName();
    }

    $ajax_response->addCommand(new ReplaceCommand('.form-item-service', $form['elements']['service']));
    return $ajax_response;
  }

}