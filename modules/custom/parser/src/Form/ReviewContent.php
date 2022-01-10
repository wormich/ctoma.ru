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
class ReviewContent extends FormBase {

  private $batch;

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_news_sourse';
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
      'file' => drupal_get_path('module', 'parser') . '/src/NewsSourse.php',
    ];

    //получаем все отзывы
    //бежим по всем отзывам и парсим содержимое
    $nids = \Drupal::entityQuery('node')->condition('type','otzyvy')->execute();
    //$nids[] = "11548";

    foreach ($nids as $nid) {
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
    $doc->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' . $orig_html);
    $xpath = new DOMXPath($doc);

    $col = $xpath->query("//p"); # &nbsp;
    foreach($col as $e) {
      $v = $e->nodeValue;

      if($v == "\r\n" || $v == " " || $v == "" || $v == "«" || $v == "»"){
        $e->parentNode->removeChild($e);
      }
    }

    $html_s = $xpath->query("//p");
    $title_date = $html_s->item($html_s->length - 1)->nodeValue;
    $text = $html_s->item(0)->nodeValue;

    $text = str_replace("«", "", $text);
    $text = str_replace("»", "", $text);
    $text = str_replace("\r\n", " ", $text);
    $node->set('body', $text);

    $date = '';
    $title = 'Пациент';
    //Гранкина М.В., 06 октября 2011
    $title_date_array = explode(", ", $title_date);
    if(count($title_date_array) == 1){
      $date = $title_date_array[0];
    } else {
      $title = $title_date_array[0];
      $date = $title_date_array[1];

    }

    $url_doctor = '';
    $link = $xpath->query("//a[contains(@class, 'name')]/@href");
    if(strstr($link->item(0)->nodeValue, 'staff/')){
      $url_doctor = substr($link->item(0)->nodeValue, 0, -1);
    }
    if($url_doctor){
      $path = \Drupal::service('path_alias.manager')->getPathByAlias($url_doctor);
      if(preg_match('/node\/(\d+)/', $path, $matches)) {
        $nid = $matches[1];
        $node->set('field_vrac', $nid);
      }
    }

    $orig_date = $date;

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

    $node->set('title', $title);
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
