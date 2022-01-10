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

class QuestionsContent extends FormBase {

  private $batch;

  private $rez = [];

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_q_content';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Start'),
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
      'file' => drupal_get_path('module', 'parser') . '/src/NewsContent.php',
    ];

    //получаем все отзывы
    //бежим по всем отзывам и парсим содержимое
    $nids = \Drupal::entityQuery('node')->condition('type','questions')->execute();

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
    $node = Node::load($nid);
    $orig_html = $node->get('field_original_html')->value;

    $doc = new DOMDocument();
    $doc->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'.$orig_html);
    $xpath = new DOMXPath($doc);

    $html_s = $xpath->query("//*[contains(@class, 'reply')]/p");
    if($html_s->length != 1){
      ksm("!!");
    }
    for ($i = $html_s->length - 1; $i > -1; $i--) {
      $q = $html_s->item($i)->nodeValue;
      $q = str_replace("«", "", $q);
      $q = str_replace("»", "", $q);
      $q = str_replace("\r\n", " ", $q);
      $node->set('field_question', $q);
    }

    $rez_html = '';

    $html_s = $xpath->query("//*[contains(@class, 'center')]/p | //*[contains(@class, 'center')]/div[not(@class)]"); //reply

    for ($i = 0; $i <= $html_s->length-1; $i++) {
      $rez_html = $rez_html . $doc->saveHTML($html_s->item($i));
      $rez_html = str_replace("<b>Ответ:</b> ", "", $rez_html);
      $node->set('field_answer', ['value' => $rez_html, 'format' => 'full_html']);
    }

    $orig_date = $node->get('field_original_date')->value;

    $orig_date = str_replace("января", "January", $orig_date);
    $orig_date = str_replace("февраля", "February", $orig_date);
    $orig_date = str_replace("марта", "March", $orig_date);
    $orig_date = str_replace("апреля", "April", $orig_date);
    $orig_date = str_replace("мая", "May", $orig_date);
    $orig_date = str_replace("июня", "June", $orig_date);
    $orig_date = str_replace("июля", "July", $orig_date);
    $orig_date = str_replace("августа", "August", $orig_date);
    $orig_date = str_replace("сентября", "September", $orig_date);
    $orig_date = str_replace("октября", "October", $orig_date);
    $orig_date = str_replace("ноября", "November", $orig_date);
    $orig_date = str_replace("декабря", "December", $orig_date);

    $date = strtotime($orig_date);

    $node->set('created', $date);

    $node->save();

  }

  /**
   * {@inheritdoc}
   */
  public function finished($success, $results, $operations) {
    drupal_set_message("ОК");
  }
}