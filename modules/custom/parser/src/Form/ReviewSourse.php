<?php

namespace Drupal\parser\Form;

use DOMDocument;
use DOMXPath;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

/**
 * Configure example settings for this site.
 */

class ReviewSourse extends FormBase {

  private $batch;

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_review_sourse';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Start parser original html'),
      '#button_type' => 'primary',
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $this->batch = [
      'title' => "Rewiew parser",
      'finished' => [$this, 'finished'],
      'file' => drupal_get_path('module', 'parser') . '/src/ReviewSourse.php',
    ];

    //получаем все отзывы
    //бежим по всем отзывам и парсим содержимое
    $nids = \Drupal::entityQuery('node')->condition('type','otzyvy')->execute();

    foreach($nids as $nid){
      $this->batch['operations'][] = [
        [$this, 'parse'],
        array($nid)
      ];
    }
    batch_set($this->batch);
  }

  /**
   * {@inheritdoc}
   */
  public function parse($nid, &$context) {

    //загружаем страницу
    //берем поле с оригинальным url
    //парсим
    //обновляем поле оригинального html

    $node = Node::load($nid);
    $url_ = "http://www.ctoma.ru" . $node->get('field_originalnyi_url')->value;

    $doc = new DOMDocument();
    $doc->loadHTMLFile($url_);
    $xpath = new DOMXPath($doc);

    $html_s = $xpath->query("//*[contains(@class, 'reply')]");
    $htmlString = $doc->saveHTML($html_s->item(0));

    $node->set('field_original_html', $htmlString);

    $node->save();
  }

  /**
   * {@inheritdoc}
   */
  public function finished($success, $results, $operations) {
    drupal_set_message("ОК");
  }
}