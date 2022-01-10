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

class NewsContent extends FormBase {

  private $batch;

  private $rez = [];

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'parser_news_content';
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
      'title' => "News parser",
      'finished' => [$this, 'finished'],
      'file' => drupal_get_path('module', 'parser') . '/src/NewsContent.php',
    ];

    //получаем все отзывы
    //бежим по всем отзывам и парсим содержимое
    $nids = \Drupal::entityQuery('node')->condition('type','news')->execute();

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

    $title_p = $xpath->query("//h1");
    $title = $title_p->item(0)->nodeValue;
    if($title){
      $node->set('title', $title);
    }

    foreach($title_p as $element){
      $element->parentNode->removeChild($element);
    }

    $col = $xpath->query("//p"); # &nbsp;
    foreach($col as $e) {
      $v = $e->nodeValue;

      if($v == "\r\n" || $v == " " || $v == ""){
        $e->parentNode->removeChild($e);
      }
    }

    //вытащить дату
    $date = $xpath->query("//p[contains(@style,'color: #AAA')]");
    $orig_date = $date->item(0)->nodeValue;
    foreach($date as $element){
      $element->parentNode->removeChild($element);
    }
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



    //фигачим картинки
    $imgs = $xpath->query("//img");
    foreach($imgs as $img){
//      $src = $img->attributes->getNamedItem('src')->nodeValue;
//      //загрузить изобращение на сервак
//      $full_img_url = "http://www.ctoma.ru" . $src;
//      $src = str_replace("/", "_", $src);
//      $data = file_get_contents($full_img_url);
//      $file = file_save_data($data, 'public://parser/newscontent/' . $src, FILE_EXISTS_REPLACE);
//      //получить новый url
//      //заменить
//      $img->setAttribute("src","/sites/default/files/parser/newscontent/".$src);
      $img->parentNode->removeChild($img);
    }
    //--

    //фигачим стили
    $style = $xpath->query("//*");
    foreach($style as $st){
      $style_ = $st->attributes->getNamedItem('style');
      if($style_){
        $st->setAttribute("style","");
      }
    }
    $body = $doc->saveHTML();
    $body = str_replace("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">", "", $body);
    $body = str_replace("<p><a href=\"/news/\" title=\"Все новости\">← Назад к новостям</a></p>", "", $body);

    $node->set('created', $date);
    $node->set('body', ['value' => $body, 'format' => 'full_html']);

    $node->save();
  }

  /**
   * {@inheritdoc}
   */
  public function finished($success, $results, $operations) {
    drupal_set_message("ОК");
  }
}